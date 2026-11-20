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

// Progress bar, current page (instructions, test, or submit), and page nav
export function TestCard({ state, progressText, ...actions }: TestCardProps) {
  const { started, page, answers, status } = state
  const scoring = status === 'scoring'

  return (
    <div
      id="trait-test"
      className="relative flex min-h-140 w-full flex-col rounded-xl bg-mist-400/90 md:max-lg:mx-auto
        md:max-lg:w-9/10"
    >
      <div className="relative flex min-h-0 flex-auto flex-col gap-3 px-4 py-8 text-sm max-sm:px-2">
        <Progress
          aria-label="Test progress"
          value={(answeredCount(answers) / items.length) * 100}
          className="mx-auto h-2 max-w-9/10 shrink-0 rounded-lg bg-mist-500/70 *:rounded-lg
            *:bg-mist-300/80"
        />
        <div className="relative h-140 max-h-140 min-h-0 flex-1">
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
        {started && !scoring && (
          <TestNav
            page={page}
            onGoto={actions.onGoto}
            onPrev={actions.onPrev}
            onNext={actions.onNext}
          />
        )}
      </div>
    </div>
  )
}
