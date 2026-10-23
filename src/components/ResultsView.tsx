import { cn } from '@/lib/utils'
import { factors, factorNames, type FactorResults } from '@/factors'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { buttonClass, tableClass } from '@/components/styles'

interface ResultsViewProps {
  results: FactorResults
  description: string | null
  onDownload: () => void
  onRegenerate: () => void
  regenerating: boolean
  regenerated: boolean
  progressText: string
}

export function ResultsView({
  results,
  description,
  onDownload,
  onRegenerate,
  regenerating,
  regenerated,
  progressText,
}: ResultsViewProps) {
  return (
    <div
      className="min-h-0 flex flex-1 flex-col items-center justify-center px-6 gap-6
        overflow-x-hidden bg-radial from-mist-600 to-mist-800"
    >
      <header
        className="w-full h-fit min-h-16 flex items-center justify-center px-4 mt-4 mx-4 rounded-2xl
        bg-mist-500/80 border-b border-l border-mist-400/80 sm:max-w-sm lg:max-w-md"
      >
        <h3
          className="tracking-wider text-2xl font-medium text-mist-300/85
          lg:text-[1.625rem]"
        >
          Your Trait Test Results
        </h3>
      </header>
      <div
        className="relative w-full h-fit flex flex-col rounded-xl bg-mist-400/75 p-3
          shadow-sm shadow-mist-900/50 sm:max-w-lg lg:max-w-xl"
      >
        <table
          className={cn(
            tableClass,
            `table-auto rounded-2xl border border-mist-600/60 bg-mist-500/50
            [&_th:last-child]:text-center [&_td:last-child]:text-center
            [&_tr>*]:border-b-mist-600/40`,
          )}
        >
          <thead className="text-lg tracking-wider text-mist-800/75 lg:text-xl">
            <tr>
              <th>Factor (Trait)</th>
              <th>Avg Response</th>
            </tr>
          </thead>
          <tbody className="text-base text-mist-700 lg:text-lg">
            {factors.map((factor) => (
              <tr key={factor}>
                <td>{factorNames[factor]}</td>
                <td className="tracking-wide italic">{results[factor].average + ' of 5'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {description && (
        <div
          aria-busy={regenerating}
          className="relative w-full h-fit flex flex-col rounded-xl bg-mist-400/70 p-3
            shadow-sm shadow-mist-900/50 sm:max-w-2xl lg:max-w-3xl"
        >
          <p
            className="rounded-2xl border border-mist-600/70 bg-mist-500/45 p-4 text-justify
              text-mist-700 text-lg lg:text-xl"
          >
            {description}
          </p>
          {/* Regen btn goes away after one use */}
          {!regenerated && (
            <div className="mt-3 flex items-center justify-end gap-3">
              {regenerating && (
                <p className="sr-only" role="status">
                  {progressText}
                </p>
              )}
              <Button
                variant="ghost"
                disabled={regenerating}
                onClick={onRegenerate}
                className={cn(
                  buttonClass,
                  'h-9 w-fit rounded-xl border border-mist-600/70 bg-mist-500/70 p-3',
                  'text-sm font-normal lg:text-base hover:bg-mist-500 hover:text-inherit',
                )}
              >
                {regenerating && <Spinner aria-hidden role="presentation" />}
                Regenerate description
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mb-8 text-neutral-200/80">
        <h3
          className="mb-3 text-lg font-normal lg:text-xl"
        >
          To use your traits with an agent:
        </h3>
        <ol
          className="list-inside list-decimal space-y-2 text-base lg:text-lg"
        >
          <li>
            Download your
            <Button
              variant="ghost"
              onClick={onDownload}
              className={cn(
                buttonClass,
                'h-9 rounded-2xl border-none bg-mist-500/75 ml-2 p-3 text-sm font-normal',
                'shadow-md shadow-mist-900/60 hover:bg-mist-500 hover:text-inherit lg:h-10',
                'lg:text-base',
              )}
            >
              TRAITS.md
            </Button>
          </li>
          <li>
            Move it to an agents folder in your home directory: <code>~/.agents/TRAITS.md</code>
          </li>
          <li>
            Point to it in a global <code>AGENTS.md</code> so your agent can use your trait data
          </li>
        </ol>
      </div>
    </div>
  )
}
