import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { buttonClass } from '@/components/styles'

interface InstructionsPanelProps {
  started: boolean
  onStart: () => void
}

export function InstructionsPanel({ started, onStart }: InstructionsPanelProps) {
  return (
    <div className="grid h-full min-h-150 place-content-center place-items-center gap-5 text-center">
      <h3 className="text-3xl font-medium text-mist-600/90 lg:text-[2.125rem] xl:text-4xl">
        Instructions
      </h3>
      <p className="max-w-9/10 text-xl text-justify leading-normal text-mist-600/90 lg:text-[1.375rem] xl:text-2xl">
      This takes about 8 minutes to finish when you take your time.
        Rank each statement as either
        <span className="italic"> way off</span>,
        <span className="italic"> inaccurate</span>,
        <span className="italic"> neither</span>,
        <span className="italic"> accurate</span>,
        or
        <span className="italic"> spot on</span>.
        For this to accurately assess your personality, respond as you see yourself in most cases
        <span className="italic"> (not how you think you should be).</span>
      </p>
      <Button
        variant="ghost"
        disabled={started}
        onClick={onStart}
        className={cn(
          buttonClass,
          'h-12 rounded-lg border-none bg-mist-500/70 p-3 text-lg font-normal shadow-none',
          'hover:bg-mist-500/90',
        )}
      >
        Start test
      </Button>
    </div>
  )
}
