import { env, pipeline, type Message, type TextGenerationPipeline } from '@huggingface/transformers'

const MODEL_ID = 'onnx-community/LFM2-1.2B-ONNX'
// q4f16 needs WebGPU shader-f16 support, q4 fallback
const DTYPE_FOR = { wasm: 'q8', webgpu: 'q4', 'webgpu-f16': 'q4f16' } as const

type Backend = keyof typeof DTYPE_FOR

// Events this worker sends to the main thread
type WorkerEvent =
  | { type: 'progress'; file: string; percent: number }
  | { type: 'generating' }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string }

// Commands the main thread sends in
type WorkerCommand = { type: 'load' } | { type: 'generate'; messages: Message[] }

// Self is typed as Window under the project's DOM lib so cast to worker global shape
const workerScope = self as unknown as {
  postMessage(message: WorkerEvent): void
  onmessage: ((ev: MessageEvent<WorkerCommand>) => void) | null
}

let generatorPromise: Promise<TextGenerationPipeline> | null = null

async function detectBackend(): Promise<Backend> {
  try {
    type Adapter = { features: { has: (feature: string) => boolean } }
    const gpu = (navigator as { gpu?: { requestAdapter: () => Promise<Adapter | null> } }).gpu
    const adapter = gpu ? await gpu.requestAdapter() : null
    if (!adapter) return 'wasm'
    return adapter.features.has('shader-f16') ? 'webgpu-f16' : 'webgpu'
  } catch {
    return 'wasm'
  }
}

function configureWasm() {
  const threads = self.crossOriginIsolated ? navigator.hardwareConcurrency ?? 1 : 1
  if (!self.crossOriginIsolated) {
    console.warn('Generator: Not cross-origin isolated. Falling back to single-threaded WASM...')
  }

  Object.assign(env.backends.onnx.wasm!, { numThreads: threads })
}

const lastLoggedPercent = new Map<string, number>()

export function getGenerator(): Promise<TextGenerationPipeline> {
  if (!generatorPromise) {
    generatorPromise = (async () => {
      const backend = await detectBackend()
      if (backend === 'wasm') configureWasm()

      return pipeline('text-generation', MODEL_ID, {
        device: backend === 'wasm' ? 'wasm' : 'webgpu',
        dtype: DTYPE_FOR[backend],
        progress_callback: (data) => {
          if (data.status !== 'progress' || data.total <= 0) return

          const percent = Math.floor((data.loaded / data.total) * 100)
          const bucket = Math.floor(percent / 10) * 10
          if (bucket > (lastLoggedPercent.get(data.file) ?? -1)) {
            lastLoggedPercent.set(data.file, bucket)
            console.log(`Generator: Downloading ${data.file}: ${bucket}%`)
            workerScope.postMessage({ type: 'progress', file: data.file, percent: bucket })
          }
        },
      })
    })()

    // Reset so failed load can be retried by a later command
    generatorPromise.catch(() => {
      generatorPromise = null
    })
  }
  return generatorPromise
}

workerScope.onmessage = async (ev) => {
  const command = ev.data

  try {
    if (command.type === 'load') {
      await getGenerator()
      return
    }

    // Generate: reuse in-flight or ready pipeline, no re-download after preload
    const generator = await getGenerator()
    workerScope.postMessage({ type: 'generating' })

    const output = await generator(command.messages, {
      do_sample: true,
      temperature: 0.4,
      top_p: 0.9,
      repetition_penalty: 1.05,
      max_new_tokens: 512,
    })

    const content = output[0].generated_text.at(-1)?.content
    if (typeof content === 'string' && content.length > 0) {
      workerScope.postMessage({ type: 'result', text: content })
    } else {
      workerScope.postMessage({ type: 'error', message: 'Model returned empty output' })
    }
  } catch (err) {
    console.error('Generator: failed', err)
    workerScope.postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
