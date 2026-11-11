import { factors, factorNames, type FactorResults } from '@/factors'
import { Button } from '@/components/ui/button'

interface ResultsViewProps {
  results: FactorResults
  description: string | null
  onDownload: () => void
}

export function ResultsView({ results, description, onDownload }: ResultsViewProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-x-hidden
        bg-radial from-mist-600 to-mist-800 px-6"
    >
      <header
        className="mx-4 mt-4 flex h-fit min-h-16 w-full items-center justify-center rounded-2xl
          border-b border-l border-mist-400/60 bg-mist-500/80 px-4 sm:max-w-sm lg:max-w-md"
      >
        <h3 className="text-2xl font-medium tracking-wider text-mist-300/80 lg:text-[1.625rem]">
          Your Trait Test Results
        </h3>
      </header>
      <div
        className="relative flex h-fit w-full flex-col rounded-xl bg-mist-400/75 p-3 sm:max-w-lg
          lg:max-w-xl"
      >
        <table
          className={`table-auto rounded-2xl border border-mist-600/60 bg-mist-500/50
            [&_td:last-child]:text-center [&_th:last-child]:text-center
            [&_tr>*]:border-b-mist-600/40`
          }
        >
          <thead className="text-lg tracking-wider text-mist-800/75 lg:text-xl">
            <tr>
              <th>Factor (Trait)</th>
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody className="text-base text-mist-800/75 lg:text-lg">
            {factors.map((factor) => (
              <tr key={factor}>
                <td>{factorNames[factor]}</td>
                <td className="tracking-widest">{results[factor].average + ' / 5'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {description && (
        <div
          className="relative flex h-fit w-full flex-col rounded-xl bg-mist-400/80 p-3
            sm:max-w-2xl lg:max-w-3xl"
        >
          <p
            className="rounded-2xl border border-mist-600/70 bg-mist-500/75 p-4 text-justify
              text-lg text-neutral-300/75 lg:text-xl"
          >
            {description}
          </p>
        </div>
      )}
      <div className="mb-8 w-full max-w-xl text-neutral-200/90 sm:max-w-2xl lg:max-w-3xl">
        <h3 className="mb-3 text-lg font-normal lg:text-xl">To use your traits with an agent:</h3>
        <ol className="list-inside list-decimal space-y-2 text-base lg:text-lg">
          <li>
            Download your
            <Button
              type="button"
              onClick={onDownload}
              aria-label="Download your TRAITS.md"
              variant="ghost"
              className={`cursor-pointer font-semibold text-shadow-[0_0.5px_oklch(100%_0_0/0.15)]
                disabled:opacity-100 disabled:text-glacier/20 ml-2 h-9 rounded-2xl border-none
                bg-mist-500/75 text-sm shadow-sm shadow-mist-900/60 hover:bg-mist-500
                hover:text-inherit lg:h-10 lg:text-base`
              }
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
