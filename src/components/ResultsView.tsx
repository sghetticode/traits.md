import { factors, factorNames, type FactorResults } from '@/factors'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'

interface ResultsViewProps {
  results: FactorResults
  description: string | null
  onDownload: () => void
}

export function ResultsView({ results, description, onDownload }: ResultsViewProps) {
  return (
    <div
      className="w-full min-h-0 flex flex-1 flex-col items-center px-6"
    >
      <Header results />
      <div className="w-9/10 mx-auto mt-12 flex flex-col md:max-w-4xl lg:mt-16 lg:max-w-6xl">
        <div
          id="results-card"
          className="h-fit mb-8 flex flex-col gap-3 self-start rounded-xl bg-mist-400/75 p-3
            lg:flex-row"
        >
          <div id="table-wrapper" className="min-w-0"
          >
            <table
              className={`w-full h-full table-auto border-separate border-spacing-0 text-left
                [&_thead]:font-semibold [&_thead]:whitespace-nowrap [&_tr>*]:px-4 [&_tr>*]:py-3
                [&_tr>*]:align-middle [&_thead_tr>*]:border-b [&_tbody_tr:not(:last-child)>*]:border-b
                rounded-2xl border border-mist-600/60 bg-mist-500/50 [&_td:last-child]:text-center
                [&_th:last-child]:text-center [&_tr>*]:border-b-mist-600/40`
              }
            >
              <thead className="text-lg tracking-wider text-mist-800/75 lg:text-xl">
                <tr>
                  <th>Factor (Trait)</th>
                  <th>Average Response</th>
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
              className="min-w-0 flex-2 rounded-2xl border border-mist-600/70 bg-mist-500/50
                p-4 text-justify text-lg text-neutral-300/75 lg:text-xl"
            >
              <p>
                {description}
              </p>
            </div>
          )}
        </div>
        <div className="mb-8 w-fit text-neutral-200/90 rounded-xl bg-mist-700/80 p-4 border-t
          border-r border-mist-500/50 shadow-sm shadow-mist-900/50 sm:max-w-2xl lg:max-w-3xl">
          <h3 className="mb-3 text-lg font-normal lg:text-xl">To use your traits with an agent:</h3>
          <ol className="list-inside list-decimal space-y-2 text-base lg:text-lg">
            <li>
              Download your
              <Button
                type="button"
                onClick={onDownload}
                aria-label="Download your TRAITS.md"
                variant="ghost"
                className={`cursor-pointer font-normal text-shadow-[0_0.5px_oklch(100%_0_0/0.15)]
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
    </div>
  )
}
