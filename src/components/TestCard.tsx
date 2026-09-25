import { items, LAST_PAGE, type Item } from '@/data/items'
import type { Rating } from '@/data/ratings'
import { answeredCount } from '@/lib/scoring'
import type { TestState } from '@/hooks/useTraitTest'
import { Progress } from '@/components/ui/progress'
import { InstructionsPanel } from '@/components/InstructionsPanel'
import { ItemPanel } from '@/components/ItemPanel'
import { SubmitPanel } from '@/components/SubmitPanel'
import { TestNav } from '@/components/TestNav'

interface TestCardProps {
  state: TestState
  progressText: string
  onStart: () => void
  onAnswer: (item: Item, rating: Rating) => void
  onGoto: (page: number) => void
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

// Progress bar, the current page (instructions, items, or submit), and page navigation
export function TestCard({ state, progressText, ...actions }: TestCardProps) {
  const { started, page, answers, status } = state
  const scoring = status === 'scoring'

  return (
    <section id="trait-test" className="flex flex-col">
      <div className="relative flex min-h-150 w-full flex-col rounded-xl bg-mist-400 px-2 py-1">
        <div className="relative flex min-h-0 flex-auto flex-col gap-2 p-6 text-sm max-sm:px-2">
          <Progress
            aria-label="Test progress"
            value={(answeredCount(answers) / items.length) * 100}
            className="bg-glacier/20 *:bg-glacier h-2 shrink-0 rounded-lg *:rounded-lg"
          />
          <div className="relative h-150 max-h-150 min-h-0 flex-1 overflow-y-auto">
            {page === 0 && <InstructionsPanel started={started} onStart={actions.onStart} />}
            {page >= 1 && page < LAST_PAGE && (
              <ItemPanel page={page} answers={answers} onAnswer={actions.onAnswer} />
            )}
            {page === LAST_PAGE && (
              <SubmitPanel
                answers={answers}
                scoring={scoring}
                progressText={progressText}
                onSubmit={actions.onSubmit}
              />
            )}
          </div>
          {!scoring && (
            <TestNav
              page={page}
              started={started}
              onGoto={actions.onGoto}
              onPrev={actions.onPrev}
              onNext={actions.onNext}
            />
          )}
        </div>
      </div>
    </section>
  )
}
