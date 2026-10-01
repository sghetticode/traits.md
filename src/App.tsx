/*
 Show intro and test UI until submit grades answers and reveals ResultsView.
 State lives in the two hooks, see src/README.md for the app's source map.
*/

import { useTraitTest } from '@/hooks/useTraitTest'
import { useDescriptionGenerator } from '@/hooks/useDescriptionGenerator'
import { downloadResults } from '@/lib/markdown'
import { recordDownload } from '@/lib/storage'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IntroCard } from '@/components/IntroCard'
import { HowItWorks } from '@/components/HowItWorks'
import { TestCard } from '@/components/TestCard'
import { ResultsView } from '@/components/ResultsView'

export function App() {
  const test = useTraitTest()
  const generator = useDescriptionGenerator()
  const { state } = test

  function handleStart() {
    test.start()
    // Load lang model in background while user takes trait test
    generator.preload()
  }

  // Submit is disabled by default and enabled only after all 50 statements are ranked
  async function handleSubmit() {
    // Grades, logs, and shows scoring panel
    const results = test.submit()
    try {
      test.scored(await generator.generate(results))
    } catch (err) {
      console.error('Error generating description. Falling back to table results.\n', err)
      test.scored(null)
    }
  }

  async function handleRegenerate() {
    if (!state.results || state.regenerated || generator.busy) return
    try {
      console.log('Regenerating personality description...')
      test.regenerated(await generator.generate(state.results))
    } catch (err) {
      // Keep the current description rather than replacing it with nothing
      console.error('Error regenerating description. Keeping the current description.\n', err)
    }
  }

  function handleDownload() {
    if (!state.results) return
    console.log('Downloading TRAITS.md file...')
    recordDownload()
    downloadResults(state.results, state.description)
  }

  return (
    <>
      {test.showResults && state.results ? (
        <ResultsView
          results={state.results}
          description={state.description}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
          regenerating={generator.busy}
          regenerated={state.regenerated}
          progressText={generator.progressText}
        />
      ) : (
        <>
          <Header />
          <main
            className="mx-6 mt-7 mb-5 flex flex-1 flex-col gap-6 sm:mx-8 md:mt-9 lg:mx-10 lg:grid
              lg:grid-cols-[minmax(0,5fr)_minmax(18rem,4fr)] lg:grid-rows-[auto_1fr] lg:gap-x-6
              lg:gap-y-4"
          >
            <h2
              className="text-[1.375rem] font-normal text-neutral-100/80 max-sm:mx-auto sm:pl-5
                sm:text-2xl md:hidden"
            >
              Let your agent get acquainted with you
            </h2>
            <IntroCard />
            <div
              id="column-left"
              className="min-w-0 text-justify lg:col-start-1 lg:row-span-2 lg:row-start-1"
            >
              <TestCard
                state={state}
                progressText={generator.progressText}
                onStart={handleStart}
                onAnswer={test.answer}
                onGoto={test.goto}
                onPrev={test.prev}
                onNext={test.next}
                onSubmit={handleSubmit}
              />
            </div>
            <HowItWorks />
          </main>
        </>
      )}
      <Footer />
    </>
  )
}
