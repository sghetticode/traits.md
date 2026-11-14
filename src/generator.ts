import type { Message } from '@huggingface/transformers'
import { factors, factorNames, setRange, type FactorResults } from './factors'

export type ProgressHandler = (status: string) => void

type GenerationOptions = {
  do_sample?: boolean
  temperature?: number
  repetition_penalty?: number
  max_new_tokens?: number
  tokenizer_encode_kwargs?: { enable_thinking?: boolean }
}

type WorkerEvent =
  | { type: 'progress'; file: string; percent: number }
  | { type: 'generating'; label: string }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string }

const DESC_GEN_RULES = `Description generation rules:
- write a single sentence for each factor (total of 5 sentences)
- choose adjectives to describe each factor based on its range
- use present tense in second person, e.g., you/your
- the tone should be observational; avoid speculation
- do not write an introduction or conclusion`

type DescriptionDraft = {
  text: string
  grade: 'pending' | 'pass' | 'fail' | 'error'
  displayed: boolean
}

let draftRun = 0

function saveDrafts(run: number, drafts: DescriptionDraft[]) {
  if (run !== draftRun) return
  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const draft = drafts[attempt - 1]
      if (draft) localStorage.setItem(`descDraft${attempt}`, JSON.stringify(draft))
      else localStorage.removeItem(`descDraft${attempt}`)
    }
    localStorage.removeItem('descDraftGrades')
    localStorage.removeItem('descriptionDrafts')
  } catch (err) {
    console.warn('Could not save description drafts:', err)
  }
}

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
          progressHandler?.(`Downloading local model... ${event.percent}%`)
          break
        case 'generating':
          progressHandler?.(event.label)
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

function gatherTraitData(results: FactorResults): string {
  return factors
    .map((factor) => {
      const name = factorNames[factor]
      const pomp = results[factor].pomp
      const range = setRange(pomp)
      return `${name}:\n  range: ${range}`
    })
    .join('\n')
}

function requestGeneration(
  messages: Message[],
  onProgress: ProgressHandler,
  label: string,
  options?: GenerationOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    pendingReject?.(new Error('Superseded by a new generation request'))

    pendingResolve = resolve
    pendingReject = reject
    progressHandler = onProgress

    getWorker().postMessage({ type: 'generate', messages, label, options })
  })
}

// Generate and grade drafts, return last draft if none pass
export async function generateDescription(
  results: FactorResults,
  onProgress: ProgressHandler,
): Promise<string> {
  const run = ++draftRun
  const drafts: DescriptionDraft[] = []
  saveDrafts(run, drafts)
  // Prompts for generating a personality trait description
  const messages: Message[] = [
    {
      role: 'system',
      content: `Follow every rule when generating output:\n\n${DESC_GEN_RULES}`,
    },
    {
      role: 'user',
      content: `Write a personality description based on the provided trait test results:\n
${gatherTraitData(results)}`,
    },
  ]

  onProgress('Preparing local model...')

  for (let attempt = 1; attempt <= 2; attempt++) {
    const label = attempt === 1
      ? 'Generating your personality description...' : 'Regenerating your personality description...'
    if (attempt === 1) {
      onProgress(label)
      console.log('Generating description...')
    }
    else {
      onProgress(label)
      console.log('Regenerating description...')
    }

    const draft = await requestGeneration(messages, onProgress, label)
    const record: DescriptionDraft = { text: draft, grade: 'pending', displayed: false }
    drafts.push(record)
    saveDrafts(run, drafts)

    try {
      const passed = await gradeDescription(results, draft, onProgress)
      record.grade = passed ? 'pass' : 'fail'
      record.displayed = passed
      saveDrafts(run, drafts)
      console.log(`Description grade: ${passed ? 'PASS' : 'FAIL'}`)
      if (passed) return draft
    } catch (err) {
      record.grade = 'error'
      record.displayed = true
      saveDrafts(run, drafts)
      console.error(`Grading description failed on attempt ${attempt}/2; returning draft.`, err)
      return draft
    }
  }

  const last = drafts[drafts.length - 1]!
  last.displayed = true
  saveDrafts(run, drafts)
  return last.text
}

async function gradeDescription(
  results: FactorResults,
  draft: string,
  onProgress: ProgressHandler,
): Promise<boolean> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `Grade the personality description using this as a rubric:\n\n${DESC_GEN_RULES}\n\n
Respond with "PASS" only if the description follows every rule in the rubric and accurately reflects
the provided test results. Otherwise, the output is inaccurate, therefore respond with "FAIL".`,
    },
    {
      role: 'user',
      content: `Test results:\n\n${gatherTraitData(results)}\n\nDescription:\n\n${draft}`,
    },
  ]

  const grade = await requestGeneration(messages, onProgress, 'Running accuracy check...', {
    do_sample: false,
    max_new_tokens: 4,
    tokenizer_encode_kwargs: { enable_thinking: false },
  })
  
  const normalizedGrade = grade
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1)
    ?.toUpperCase()

  if (normalizedGrade === 'PASS') return true
  if (normalizedGrade === 'FAIL') return false
  return false
}
