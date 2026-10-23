import type { Message } from '@huggingface/transformers'
import { factors, factorNames, type FactorResults } from './factors'

export type ProgressHandler = (status: string) => void

type WorkerEvent =
  | { type: 'progress'; file: string; percent: number }
  | { type: 'generating' }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string }

let worker: Worker | null = null
let progressHandler: ProgressHandler | null = null
let pendingResolve: ((text: string) => void) | null = null
let pendingReject: ((err: Error) => void) | null = null

function settle() {
  pendingResolve = null
  pendingReject = null
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./generator.worker.ts', import.meta.url), { type: 'module' })

    worker.addEventListener('message', (ev: MessageEvent<WorkerEvent>) => {
      const event = ev.data

      switch (event.type) {
        case 'progress':
          progressHandler?.(`Downloading model... ${event.percent}%`)
          break
        case 'generating':
          progressHandler?.('Generating description...')
          break
        case 'result':
          pendingResolve?.(event.text)
          settle()
          break
        case 'error':
          if (pendingReject) {
            pendingReject(new Error(event.message))
            settle()
          } else {
            // Preload failure with no pending request
            console.error('Generator:', event.message)
          }
          break
      }
    })
  }

  return worker
}

// Load Transformers.js model while user takes test
export function preloadGenerator() {
  getWorker().postMessage({ type: 'load' })
}

// Generate a personality description from trait test results
export function generateDescription(
  results: FactorResults,
  onProgress: ProgressHandler,
): Promise<string> {
  return new Promise((resolve, reject) => {
    pendingReject?.(new Error('Superseded by a new generation request'))

    pendingResolve = resolve
    pendingReject = reject
    progressHandler = onProgress

    const traitData = factors
      .map((factor) => {
        const name = factorNames[factor]
        const average = results[factor].average
        const pomp = results[factor].pomp
        return `${name}:\n  average response: ${average}/5\n  percentage: ${pomp}`
      })
      .join('\n')

    const messages: Message[] = [
      {
        role: 'system',
        // Prompt for generating user personality description
        content:
          `Write a personality description using these rules:
          Text output:
          - write 5 sentences (one for each factor)
          - never put numeric scores in the description
          Writing style:
          - use present tense in second person (you/your)
          - base adjective choice on trait test scores
          - the tone should be observational`
      },
      { role: 'user', content: traitData },
    ]

    onProgress('Preparing model...')
    getWorker().postMessage({ type: 'generate', messages })
  })
}
