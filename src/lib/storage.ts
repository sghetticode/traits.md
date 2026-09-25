import { factors, type FactorResults } from '@/factors'
import { items, LAST_PAGE } from '@/data/items'
import { RATINGS, type Rating } from '@/data/ratings'
import type { Answers } from '@/lib/scoring'

// The part of the test state that survives a reload
export interface Session {
  started: boolean
  page: number
  answers: Answers
  results: FactorResults | null
  description: string | null
}

const HOUR = 3600 * 1000

const fresh = (): Session => ({
  started: false,
  page: 0,
  answers: {},
  results: null,
  description: null,
})

// Before the React port, answers were keyed by item text: lowercased, trailing period removed
export function textKey(text: string): string {
  return text.toLowerCase().replace(/\.$/, '')
}

const idByTextKey = new Map(items.map((item) => [textKey(item.text), item.id]))
const itemIds = new Set(items.map((item) => item.id))
const ratingValues = new Set<string>(RATINGS.map((rating) => rating.value))

// JSON.parse that treats unreadable data as "key absent" instead of throwing
function readJson(key: string): unknown {
  const raw = localStorage.getItem(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Keep valid entries only. Text keys from the old build are migrated to canonical ids first
function readAnswers(): Answers {
  const stored = readJson('answers')
  if (!isRecord(stored)) return {}

  const answers: Answers = {}
  for (const [key, value] of Object.entries(stored)) {
    const id = /^\d+$/.test(key) ? Number(key) : idByTextKey.get(key)
    if (id === undefined || !itemIds.has(id)) continue
    if (typeof value !== 'string' || !ratingValues.has(value)) continue
    answers[id] = value as Rating
  }
  return answers
}

// Valid only with all five factors, each with a finite total and percentage
function readResults(): FactorResults | null {
  const stored = readJson('results')
  if (!isRecord(stored)) return null

  const results = {} as FactorResults
  for (const factor of factors) {
    const entry = stored[factor]
    if (!isRecord(entry)) return null
    const { total, percentage } = entry
    if (typeof total !== 'number' || !Number.isFinite(total)) return null
    if (typeof percentage !== 'number' || !Number.isFinite(percentage)) return null
    results[factor] = { total, percentage }
  }
  return results
}

// Read and validate the saved session. Anything invalid falls back to its fresh value.
// Idempotent, so it's safe for React StrictMode to call it twice
export function loadSession(): Session {
  // Clear all local data an hour after the results file was downloaded
  const downloadTimestamp = Number(localStorage.getItem('downloadTimestamp'))
  if (downloadTimestamp && Date.now() - downloadTimestamp > HOUR) {
    localStorage.clear()
    return fresh()
  }

  // Only the removed pre-paint script read this
  localStorage.removeItem('testSubmitted')

  // Saved results win outright: show them, and drop the finished test's progress
  const results = readResults()
  if (results) {
    localStorage.removeItem('answers')
    localStorage.removeItem('testStarted')
    localStorage.removeItem('panelRendered')

    const description = localStorage.getItem('traitDescription')
    return { ...fresh(), results, description: description ? description : null }
  }

  const started = localStorage.getItem('testStarted') === 'true'
  const page = Number(localStorage.getItem('panelRendered'))

  return {
    started,
    page: started && Number.isInteger(page) && page >= 0 && page <= LAST_PAGE ? page : 0,
    answers: readAnswers(),
    results: null,
    // A description without results is stale, so it's dropped along with them
    description: null,
  }
}

function writeOrRemove(key: string, value: string | null) {
  if (value === null) localStorage.removeItem(key)
  else localStorage.setItem(key, value)
}

// Mirror the session into localStorage, removing keys whose value is empty. Idempotent
export function saveSession(session: Session) {
  writeOrRemove('testStarted', session.started ? 'true' : null)
  writeOrRemove('panelRendered', session.page ? String(session.page) : null)
  writeOrRemove(
    'answers',
    Object.keys(session.answers).length ? JSON.stringify(session.answers) : null,
  )
  writeOrRemove('results', session.results ? JSON.stringify(session.results) : null)
  writeOrRemove('traitDescription', session.description)
}
