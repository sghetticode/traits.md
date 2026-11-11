import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { items } from '@/data/items'
import { answeredCount, type Answers } from '@/lib/scoring'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface SubmitPanelProps {
  answers: Answers
  scoring: boolean
  progressText: string
  onSubmit: () => void
}

export function SubmitPanel({ answers, scoring, progressText, onSubmit }: SubmitPanelProps) {
  const remaining = items.length - answeredCount(answers)
  const scoringRef = useRef<HTMLDivElement>(null)

  // Move focus to the scoring panel once it's on screen.
  // An effect, not the click handler: the panel doesn't exist yet when Submit is clicked
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
          <span className="text-xl font-medium text-mist-600 md:text-2xl">
            Scoring your trait test
          </span>
          <Spinner className="size-8" />
          <p
            className="text-base text-mist-600 italic md:text-xl"
            role="status"
          >
            {progressText}
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-medium text-mist-600/90 md:text-3xl">
            Submit your trait test
          </h3>
          {remaining > 0 && (
            <p
              className="mt-2 text-base text-orange-800 italic sm:text-lg xl:text-xl 2xl:text-2xl"
              role="alert"
            >
              Rate every item to submit ({remaining} left)
            </p>
          )}
          <Button
            type="button"
            onClick={onSubmit}
            aria-label="Submit test"
            disabled={remaining > 0}
            variant="ghost"
            className={`cursor-pointer font-semibold text-shadow-[0_0.5px_oklch(100%_0_0/0.15)]
              disabled:opacity-100 disabled:text-glacier/20 mt-4 h-12 rounded-md border-none
              bg-mist-500/70 p-3 text-lg shadow-none hover:bg-mist-500/90`
            }
          >
            Submit
          </Button>
        </>
      )}
    </div>
  )
}
