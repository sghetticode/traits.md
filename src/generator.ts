import type { Message } from '@huggingface/transformers'
import { factors, factorNames, type FactorResults } from './data/factors'
import { setRange } from './lib/scoring'

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
- describe tendencies associated with the range of each factor
- do not inlude the names of ranges in the description
- the tone should be observational; avoid speculating about abilities
- use present tense in second person, e.g., you/your
- never write an introduction or conclusion`

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

// Generate personality description based on trait test results
export async function generateDescription(
  results: FactorResults,
  onProgress: ProgressHandler,
): Promise<string> {
  const run = ++draftRun
  const drafts: DescriptionDraft[] = []
  saveDrafts(run, drafts)
  // Local model system prompt
  const messages: Message[] = [
    {
      role: 'system',
      content: `Follow every rule when generating output:\n\n${DESC_GEN_RULES}`,
    },
    // Prompt for generating a description
    {
      role: 'user',
      content: `Write a personality description based on the provided trait test results:\n
${gatherTraitData(results)}`,
    },
  ]

  onProgress('Preparing local model...')

  for (let attempt = 1; attempt <= 2; attempt++) {
    const label =
      attempt === 1
        ? 'Generating your personality description...'
        : 'Regenerating your personality description...'
    if (attempt === 1) {
      onProgress(label)
      console.log('Generating description...')
    } else {
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

function countSentences(draft: string): number {
  const text = draft.trim()
  if (!text) return 0

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)

  return sentences?.length ?? 0
}

async function gradeDescription(
  results: FactorResults,
  draft: string,
  onProgress: ProgressHandler,
): Promise<boolean> {
  const tally = countSentences(draft)

  if (tally !== 5) {
    console.log(`Draft length check failed (${tally} sentences)`)
    return false
  } else {
    console.log(`Draft length check passed (${tally} sentences)`)
  }

  const messages: Message[] = [
    {
      role: 'system',
      content: `Grade the quality of the personality description using the following as a rubric:
- describes tendencies associated with the given range of each factor
- uses present tense in second person, e.g., you/your
- does not inlude the names of ranges in the description
- the tone is observational and avoids speculation
- the paragraph has neither a conclusion or introduction`,
    },
    {
      role: 'user',
      content: `Respond with "PASS" only if the description follows every rule in the rubric and accurately
      reflects the provided test results. Otherwise, the output is inaccurate, so respond with "FAIL".
      Output only one word for the resulting grade: PASS or FAIL.
      Test results:\n\n${gatherTraitData(results)}\n\nDescription:\n\n${draft}`,
    },
  ]

  const grade = await requestGeneration(messages, onProgress, 'Running accuracy check...', {
    do_sample: false,
    max_new_tokens: 24,
    tokenizer_encode_kwargs: { enable_thinking: false },
  })

  const normalizedGrade = grade
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1)
    ?.toUpperCase()
    .replace(/[^A-Z]/g, '')

  if (normalizedGrade === 'PASS') return true
  if (normalizedGrade === 'FAIL') return false
  
  // Fail closed default
  return false
}
