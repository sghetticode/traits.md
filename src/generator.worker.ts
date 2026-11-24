import { env, pipeline, type Message, type TextGenerationPipeline } from '@huggingface/transformers'

const MODEL_ID = 'onnx-community/LFM3-1.7B-ONNX'
// q4f16 needs WebGPU shader-f16 support, q4 fallback
const DTYPE_FOR = { wasm: 'q8', webgpu: 'q4', 'webgpu-f16': 'q4f16' } as const

type Backend = keyof typeof DTYPE_FOR

// Events this worker sends to the main thread:
type WorkerEvent =
  | { type: 'progress'; file: string; percent: number }
  | { type: 'generating'; label: string }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string }

type GenerationOptions = {
  do_sample?: boolean
  temperature?: number
  repetition_penalty?: number
  max_new_tokens?: number
  tokenizer_encode_kwargs?: { enable_thinking?: boolean }
}

// Commands the main thread sends in
type WorkerCommand =
  | { type: 'load' }
  | {
      type: 'generate'
      messages: Message[]
      label?: string
      options?: GenerationOptions
    }

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
  const threads = self.crossOriginIsolated ? (navigator.hardwareConcurrency ?? 1) : 1
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
          // Calculate percentage and log progress
          const percent = Math.floor((data.loaded / data.total) * 100)
          const step = Math.floor(percent / 25) * 25
          if (step > (lastLoggedPercent.get(data.file) ?? -1)) {
            lastLoggedPercent.set(data.file, step)
            console.log(`Generator: Downloading ${data.file}: ${step}%`)
            workerScope.postMessage({ type: 'progress', file: data.file, percent: step })
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

    const generator = await getGenerator()
    workerScope.postMessage({
      type: 'generating',
      label: command.label ?? 'Generating description...',
    })

    const output = await generator(command.messages, {
      max_new_tokens: 256,
      tokenizer_encode_kwargs: { enable_thinking: false },
      // Sampling and logits params for text generation
      do_sample: true,
      temperature: 0.4,
      top_k: 50,
      repetition_penalty: 1.05,
      ...command.options,
    })

    const raw = output[0].generated_text.at(-1)?.content
    const content = typeof raw === 'string' ? stripThinking(raw) : ''
    if (content.length > 0) {
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

function stripThinking(text: string): string {
  const open = text.indexOf('<think>')
  if (open !== -1) text = text.slice(0, open)
  
  const close = text.lastIndexOf('</think>')
  if (close !== -1) text = text.slice(close + '</think>'.length)

  return text
}
