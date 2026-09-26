import { useEffect, useReducer } from 'react'
import type { FactorResults } from '@/factors'
import { items, LAST_PAGE, type Item } from '@/data/items'
import type { Rating } from '@/data/ratings'
import { gradeTest, logResults } from '@/lib/scoring'
import { loadSession, saveSession, textKey, type Session } from '@/lib/storage'

export interface TestState extends Session {
  // `started` is separate from `page`: once started, page 0 shows the instructions with Start
  // disabled and the nav enabled, so going back to page 0 must not undo it
  status: 'idle' | 'scoring' // transient, never saved
}

export type TestAction =
  | { type: 'start' }
  | { type: 'answer'; id: number; rating: Rating }
  | { type: 'goto'; page: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'submit'; results: FactorResults }
  | { type: 'scored'; description: string | null }

const clampPage = (page: number) => Math.min(LAST_PAGE, Math.max(0, page))

// Pure: returns the next state and never logs or touches storage (StrictMode may call it twice)
export function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'start':
      return { ...state, started: true, page: 1 }
    case 'answer':
      return { ...state, answers: { ...state.answers, [action.id]: action.rating } }
    case 'goto':
      return { ...state, page: clampPage(action.page) }
    case 'next':
      return { ...state, page: clampPage(state.page + 1) }
    case 'prev':
      return { ...state, page: clampPage(state.page - 1) }
    case 'submit':
      // Answers stay until scoring ends, so the progress bar stays full while the model runs
      return { ...state, results: action.results, status: 'scoring' }
    case 'scored':
      return {
        ...state,
        description: action.description,
        status: 'idle',
        answers: {},
        started: false,
        page: 0,
      }
  }
}

function init(): TestState {
  return { ...loadSession(), status: 'idle' }
}

export function useTraitTest() {
  const [state, dispatch] = useReducer(testReducer, undefined, init)
  const { started, page, answers, results, description } = state

  // The only writer of these five keys; runs after any of them changes
  useEffect(() => {
    saveSession({ started, page, answers, results, description })
  }, [started, page, answers, results, description])

  return {
    state,
    // Submit sets results before scoring and the scoring panel must show
    showResults: results !== null && state.status === 'idle',

    // Actions log here rather than in the reducer, so each log line prints once per click
    start() {
      console.log('User started test')
      dispatch({ type: 'start' })
      console.log('Rendered test panel 1')
    },
    answer(item: Item, rating: Rating) {
      console.log(`${textKey(item.text)}: ${rating}`)
      dispatch({ type: 'answer', id: item.id, rating })
    },
    goto(page: number) {
      dispatch({ type: 'goto', page })
    },
    next() {
      dispatch({ type: 'next' })
    },
    prev() {
      dispatch({ type: 'prev' })
    },
    // Grade the current answers, switch to scoring, and return the results for the generator
    submit(): FactorResults {
      console.log('Trait test submitted')
      console.log('Grading trait test...')
      const graded = gradeTest(answers, items)
      logResults(graded)
      dispatch({ type: 'submit', results: graded })
      return graded
    },
    scored(description: string | null) {
      dispatch({ type: 'scored', description })
    },
  }
}
