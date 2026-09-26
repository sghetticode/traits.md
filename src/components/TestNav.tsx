import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { buttonClass } from '@/components/styles'

const NUMBERED_PAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

interface TestNavProps {
  page: number
  started: boolean
  onGoto: (page: number) => void
  onPrev: () => void
  onNext: () => void
}

// daisyUI btn-md, then btn-sm from lg up
const navButtonClass = cn(
  buttonClass,
  'h-10 rounded-none border-none px-4 text-sm shadow-none lg:h-8 lg:px-3 lg:text-xs',
  'hover:bg-mist-600/70',
)

export function TestNav({ page, started, onGoto, onPrev, onNext }: TestNavProps) {
  return (
    <ButtonGroup
      aria-label="Test pages"
      className={cn(
        'mx-auto mt-3 shrink-0 flex-wrap justify-center',
        // Rounded outer corners only, 4px like daisyUI's join (ButtonGroup would round the last to 8px)
        '[&>*:first-child]:rounded-l-sm [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-sm!',
        // Buttons overlap by 1px, except disabled ones (daisyUI join-item)
        '[&>*:not(:first-child):not(:disabled)]:-ms-px',
      )}
    >
      <Button
        variant="ghost"
        type="button"
        aria-label="Previous page"
        disabled={!started}
        onClick={onPrev}
        className={cn(navButtonClass, 'bg-mist-700/80')}
      >
        &lt;
      </Button>
      {NUMBERED_PAGES.map((n) => {
        const active = started && n === page
        return (
          <Button
            key={n}
            variant="ghost"
            type="button"
            disabled={!started}
            aria-current={active ? 'page' : undefined}
            onClick={() => onGoto(n)}
            className={cn(navButtonClass, active ? 'bg-mist-600/70' : 'bg-mist-700/80')}
          >
            {n}
          </Button>
        )
      })}
      <Button
        variant="ghost"
        type="button"
        aria-label="Next page"
        disabled={!started}
        onClick={onNext}
        className={cn(navButtonClass, 'bg-mist-700/80')}
      >
        &gt;
      </Button>
    </ButtonGroup>
  )
}
