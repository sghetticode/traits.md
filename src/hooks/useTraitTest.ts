import { useEffect, useReducer } from 'react'
import type { FactorResults } from '@/factors'
import { items, LAST_PAGE, type Item } from '@/data/items'
import type { Rating } from '@/data/ratings'
import { gradeTest, logResults } from '@/lib/scoring'
import { loadSession, saveSession, textKey, type Session } from '@/lib/storage'

/*
 Test page 0 shows instructions with start btn enabled.
 Once started nav btns are enabled and start btn is disabled.
 Going back to the instructions page shouldn't undo this.
*/

export interface TestState extends Session {
  status: 'idle' | 'scoring'
}

export type TestAction =
  | { type: 'start' }
  | { type: 'answer'; id: number; rating: Rating }
  | { type: 'goto'; page: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'submit'; results: FactorResults }
  | { type: 'scored'; description: string | null }
  | { type: 'regenerated'; description: string }

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
      return { ...state, results: action.results, status: 'scoring', regenerated: false }
    case 'scored':
      return {
        ...state,
        description: action.description,
        status: 'idle',
        answers: {},
        started: false,
        page: 0,
      }
    case 'regenerated':
      return { ...state, description: action.description, regenerated: true }
  }
}

function init(): TestState {
  return { ...loadSession(), status: 'idle' }
}

export function useTraitTest() {
  const [state, dispatch] = useReducer(testReducer, undefined, init)
  const { started, page, answers, results, description, regenerated } = state

  // The only writer of these session keys; runs after any of them changes
  useEffect(() => {
    saveSession({ started, page, answers, results, description, regenerated })
  }, [started, page, answers, results, description, regenerated])

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
    // Swap in the regenerated description and use up the single allowed regenerate
    regenerated(description: string) {
      dispatch({ type: 'regenerated', description })
    },
  }
}
