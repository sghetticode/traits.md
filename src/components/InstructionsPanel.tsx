import { Button } from '@/components/ui/button'

interface InstructionsPanelProps {
  started: boolean
  onStart: () => void
}

export function InstructionsPanel({ started, onStart }: InstructionsPanelProps) {
  return (
    <div className="grid h-full min-h-140 place-content-center place-items-center gap-5 text-center">
      <h3 className="text-3xl font-medium text-mist-600 lg:text-[2.125rem] xl:text-4xl">
        Instructions
      </h3>
      <p
        className="max-w-9/10 text-justify text-xl leading-normal text-mist-600 lg:text-[1.375rem]
          xl:text-2xl"
      >
        The test takes about 6 minutes to finish when you take your time. Rank each statement as
        either
        <span className="font-medium"> way off</span>,
        <span className="font-medium"> inaccurate</span>,
        <span className="font-medium"> neither</span>,<span className="font-medium"> accurate</span>
        , or
        <span className="font-medium"> spot on</span>. For it to accurately assess your personality,
        respond as you usually see yourself
        <span className="italic">, not how you think you should be.</span>
      </p>
      <Button
        type="button"
        onClick={onStart}
        aria-label="Start test"
        disabled={started}
        variant="ghost"
        className={`cursor-pointer font-semibold text-shadow-[0_0.5px_oklch(100%_0_0/0.15)]
          disabled:opacity-100 disabled:text-glacier/20 h-12 rounded-lg border-none
          bg-mist-500/70 p-3 text-lg shadow-none hover:bg-mist-500/90`
        }
      >
        Start test
      </Button>
    </div>
  )
}
