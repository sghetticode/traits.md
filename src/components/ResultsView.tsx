import { cn } from '@/lib/utils'
import { factors, factorNames, formatPercentage, levelFor, type FactorResults } from '@/factors'
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
      className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 gap-6
        overflow-x-hidden overflow-y-auto bg-radial from-mist-600 to-mist-800 lg:p-7 lg:gap-7 
        xl:p-8 xl:gap-8"
    >
      <h3
        className="text-center underline underline-offset-3 text-2xl font-normal text-neutral-100 xl:text-[28px]"
      >
        Your trait test scores
      </h3>
      <div
        className="relative flex h-fit w-full max-w-xl flex-col rounded-xl bg-mist-400/75 p-3
          shadow-md shadow-mist-900/60 lg:max-w-2xl lg:p-4 xl:max-w-3xl"
      >
        <table
          className={cn(
            tableClass,
            'rounded-lg border border-mist-600/60 bg-mist-500/50 [&_tr>*]:border-b-mist-600/30',
          )}
        >
          <thead className="text-lg text-neutral-100 xl:text-xl">
            <tr>
              <th>Factor</th>
              <th>Percent</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody className="text-neutral-100 lg:text-lg">
            {factors.map((factor) => (
              <tr key={factor}>
                <td>{factorNames[factor]}</td>
                <td>{formatPercentage(results[factor].percentage)}</td>
                <td className='italic'>{levelFor(results[factor].percentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {description && (
        <div
          aria-busy={regenerating}
          className="relative flex h-fit w-full max-w-xl flex-col rounded-lg bg-mist-400/80 p-3
            shadow-md shadow-mist-900/60 lg:max-w-2xl lg:p-4 xl:max-w-3xl"
        >
          <p
            className="rounded-md border border-mist-600/40 bg-mist-500/70 p-4 text-justify
            text-neutral-100 lg:text-lg"
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
      <div className="w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <h3
          className="mb-3 text-lg font-normal text-neutral-100 lg:text-xl"
        >
          To use your traits with an agent:
        </h3>
        <ol
          className="list-inside list-decimal space-y-2 text-base text-neutral-100 lg:text-lg"
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
