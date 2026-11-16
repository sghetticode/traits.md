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

const itemIds = new Set(items.map((item) => item.id))
const ratingValues = new Set<string>(RATINGS.map((rating) => rating.value))

// Treats unreadable data as an absent key instead of throwing
function readJSON(key: string): unknown {
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

function readAnswers(): Answers {
  const stored = readJSON('answers')
  if (!isRecord(stored)) return {}

  const answers: Answers = {}
  for (const [key, value] of Object.entries(stored)) {
    if (!/^\d+$/.test(key)) continue
    const id = Number(key)
    if (!itemIds.has(id)) continue
    if (typeof value !== 'string' || !ratingValues.has(value)) continue
    answers[id] = value as Rating
  }
  return answers
}

// Valid only with all five factors, each with a finite total and POMP
function readResults(): FactorResults | null {
  const stored = readJSON('testResults')
  if (!isRecord(stored)) return null

  const results = {} as FactorResults
  for (const factor of factors) {
    const entry = stored[factor]
    if (!isRecord(entry)) return null
    const { total } = entry
    const pomp = entry.pomp ?? entry.percentage
    if (typeof total !== 'number' || !Number.isFinite(total)) return null
    if (typeof pomp !== 'number' || !Number.isFinite(pomp)) return null
    results[factor] = { total, average: total / 10, pomp }
  }
  return results
}

/*
 Read and validate the saved session, invalid falls back to fresh value
 Safe for React StrictMode to call more than once
*/
export function loadSession(): Session {
  // Clear all local data an hour after the results file was downloaded
  const downloadTimestamp = Number(localStorage.getItem('downloadTimestamp'))
  if (downloadTimestamp && Date.now() - downloadTimestamp > HOUR) {
    localStorage.clear()
    return fresh()
  }

  localStorage.removeItem('testSubmitted')

  // Saved results win outright: show them, and drop the finished test's progress
  const results = readResults()
  if (results) {
    localStorage.removeItem('answers')
    localStorage.removeItem('testStarted')
    localStorage.removeItem('panelRendered')

    const description = localStorage.getItem('traitDescription')
    return {
      ...fresh(),
      results,
      description: description ? description : null,
    }
  }

  const started = localStorage.getItem('testStarted') === 'true'
  const page = Number(localStorage.getItem('panelRendered'))

  return {
    started,
    page: started && Number.isInteger(page) && page >= 0 && page <= LAST_PAGE ? page : 0,
    answers: readAnswers(),
    results: null,
    description: null,
  }
}

// Save session to localStorage, remove keys with empty values
export function saveSession(session: Session) {
  if (session.results && !session.started && !Object.keys(session.answers).length) {
    localStorage.removeItem('panelRendered')
  } else {
    localStorage.setItem('panelRendered', String(session.page))
  }
  
  if (session.started) localStorage.setItem('testStarted', 'true')
  else localStorage.removeItem('testStarted')
  
  if (Object.keys(session.answers).length) {
    localStorage.setItem('answers', JSON.stringify(session.answers))
  } else {
    localStorage.removeItem('answers')
  }
  
  if (session.results) {
    localStorage.setItem('testResults', JSON.stringify(session.results))
  } else {
    localStorage.removeItem('testResults')
  }
  
  if (session.description === null) {
    localStorage.removeItem('traitDescription')
  } else {
    localStorage.setItem('traitDescription', session.description)
  }
}

// Start the one-hour countdown to clearing local data. Called by the Download click handler only
export function recordDownload() {
  localStorage.setItem('downloadTimestamp', String(Date.now()))
}
