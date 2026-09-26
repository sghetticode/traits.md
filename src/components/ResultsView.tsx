import { cn } from '@/lib/utils'
import { factors, factorNames, levelFor, type FactorResults } from '@/factors'
import { Button } from '@/components/ui/button'
import { buttonClass, tableClass } from '@/components/styles'

interface ResultsViewProps {
  results: FactorResults
  description: string | null
  onDownload: () => void
}

export function ResultsView({ results, description, onDownload }: ResultsViewProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-x-hidden
        overflow-y-auto bg-radial from-mist-700 from-30% to-mist-800 p-4 sm:gap-6 lg:gap-8 lg:p-8
        xl:gap-9 xl:p-9 2xl:gap-12 2xl:p-12"
    >
      <h3
        className="text-center text-xl font-normal text-neutral-100 sm:text-2xl xl:text-3xl
          2xl:text-4xl"
      >
        Your personality traits
      </h3>
      <div
        className="relative flex h-fit w-full max-w-lg flex-col rounded-xl bg-mist-400/75 p-4
          shadow-md shadow-mist-900/60 lg:max-w-2xl xl:max-w-3xl xl:p-6 2xl:p-8"
      >
        <table
          className={cn(
            tableClass,
            'rounded-lg border border-mist-600/60 bg-mist-500/50 [&_tr>*]:border-b-mist-600/30',
          )}
        >
          <thead className="text-sm text-neutral-100 sm:text-base xl:text-xl 2xl:text-2xl">
            <tr>
              <th>Factor</th>
              <th>Percent</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody className="text-xs text-neutral-100 sm:text-sm xl:text-lg 2xl:text-xl">
            {factors.map((factor) => (
              <tr key={factor}>
                <td>{factorNames[factor]}</td>
                <td>{Math.round(results[factor].percentage)}%</td>
                <td>{levelFor(results[factor].percentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* The card stays when there's no description (table-only fallback), as it did before */}
      <div
        className="relative flex h-fit w-full max-w-lg flex-col rounded-lg bg-mist-400/80 p-5
          shadow-md shadow-mist-900/60 lg:max-w-2xl xl:max-w-3xl"
      >
        {description && (
          <p
            className="rounded-md border border-mist-600/40 bg-mist-500/70 p-4 text-justify text-sm
              leading-normal text-neutral-100 sm:text-base xl:text-xl 2xl:text-2xl"
          >
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
        <h3
          className="mb-3 text-base font-normal text-neutral-100 sm:text-lg xl:text-xl 2xl:text-2xl"
        >
          To use your trait data:
        </h3>
        <ol
          className="list-inside list-decimal space-y-2 text-sm text-neutral-100 sm:text-base
            xl:text-lg 2xl:text-xl"
        >
          <li>
            Download your
            <Button
              variant="ghost"
              onClick={onDownload}
              className={cn(
                buttonClass,
                'ml-1 h-8 rounded-full border-none bg-mist-500/75 p-3 text-xs font-normal shadow-sm',
                'shadow-mist-900/60 hover:bg-mist-500 hover:text-inherit sm:h-10 sm:text-sm lg:h-12',
                'lg:text-lg',
              )}
            >
              TRAITS.md
            </Button>
          </li>
          <li>
            Move it to the agents folder in your home directory: <code>~/.agents/TRAITS.md</code>
          </li>
          <li>
            Reference it in a global <code>AGENTS.md</code> so any of your agents can access your
            trait data
          </li>
        </ol>
      </div>
    </div>
  )
}
