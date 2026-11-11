import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

const NUMBERED_PAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

interface TestNavProps {
  page: number
  started: boolean
  onGoto: (page: number) => void
  onPrev: () => void
  onNext: () => void
}

const navButtonClass = cn(`cursor-pointer font-semibold text-shadow-[0_0.5px_oklch(100%_0_0/0.15)]
  disabled:opacity-100 disabled:text-glacier/20 h-8 px-2.5 border-none rounded-none text-xs
  shadow-none lg:h-9 lg:px-3 hover:bg-mist-600/70`
)

export function TestNav({ page, started, onGoto, onPrev, onNext }: TestNavProps) {
  return (
    <ButtonGroup
      aria-label="Trait test pages"
      className={`mx-auto mt-3 shrink-0 flex-wrap justify-center [&>*:first-child]:rounded-l-sm
        [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-sm! [&>*:not(:first-child):not(:disabled)]:-ms-px`
      }
    >
      <Button
        type="button"
        onClick={onPrev}
        aria-label="Previous page"
        disabled={!started}
        variant="ghost"
        className={cn(navButtonClass, 'bg-mist-700/80')}
      >
        &lt;
      </Button>
      {NUMBERED_PAGES.map((n) => {
        const active = started && n === page
        return (
          <Button
            type="button"
            onClick={() => onGoto(n)}
            aria-current={active ? 'page' : undefined}
            disabled={!started}
            key={n}
            variant="ghost"
            className={cn(navButtonClass, active ? 'bg-mist-600/70' : 'bg-mist-700/80')}
          >
            {n}
          </Button>
        )
      })}
      <Button
        type="button"
        onClick={onNext}
        aria-label="Next page"
        disabled={!started}
        variant="ghost"
        className={cn(navButtonClass, 'bg-mist-700/80')}
      >
        &gt;
      </Button>
    </ButtonGroup>
  )
}
