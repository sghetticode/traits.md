import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { items } from '@/data/items'
import { answeredCount, type Answers } from '@/lib/scoring'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { buttonClass } from '@/components/styles'

interface SubmitPanelProps {
  answers: Answers
  scoring: boolean
  progressText: string
  onSubmit: () => void
}

export function SubmitPanel({ answers, scoring, progressText, onSubmit }: SubmitPanelProps) {
  const remaining = items.length - answeredCount(answers)
  const scoringRef = useRef<HTMLDivElement>(null)

  // Move focus to the scoring panel once it's on screen. An effect, not the click handler: the panel
  // doesn't exist yet when Submit is clicked
  useEffect(() => {
    if (scoring) scoringRef.current?.focus()
  }, [scoring])

  return (
    <div className="grid h-full min-h-150 place-content-center place-items-center">
      {scoring ? (
        <div
          ref={scoringRef}
          tabIndex={-1}
          className="grid h-full min-h-138 place-content-center place-items-center gap-5
            2xl:min-h-150"
        >
          <span className="text-lg font-medium text-mist-600 sm:text-xl xl:text-2xl 2xl:text-3xl">
            Scoring your trait test
          </span>
          <Spinner className="size-8" />
          <p
            className="text-sm text-mist-600 italic sm:text-base xl:text-lg 2xl:text-xl"
            role="status"
          >
            {progressText}
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-medium text-mist-600 sm:text-2xl xl:text-3xl 2xl:text-4xl">
            Submit your trait test
          </h3>
          {remaining > 0 && (
            <p
              className="mt-2 text-base text-orange-800 italic sm:text-lg xl:text-xl 2xl:text-2xl"
              role="alert"
            >
              Rate every item to submit ({remaining} remain)
            </p>
          )}
          <Button
            variant="ghost"
            type="button"
            disabled={remaining > 0}
            onClick={onSubmit}
            className={cn(
              buttonClass,
              'mt-4 h-12 rounded-md border-none bg-mist-500/70 p-3 text-lg font-normal shadow-none',
              'hover:bg-mist-500/90',
            )}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  )
}
