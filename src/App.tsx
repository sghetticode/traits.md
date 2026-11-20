/* Display trait test until answers are submitted then show user resutls.
 * App state lives in hooks: useTraitTest and useDescriptionGenerator.
 * See src/README.md for source map. */

import { useTraitTest } from '@/hooks/useTraitTest'
import { useDescriptionGenerator } from '@/hooks/useDescriptionGenerator'
import { downloadMarkdown } from '@/lib/exportMarkdown'
import { recordDownload } from '@/lib/storage'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IntroCard } from '@/components/IntroCard'
import { HowItWorksAccordion } from '@/components/HowItWorksAccordion'
import { TestCard } from '@/components/TestCard'
import { ResultsView } from '@/components/ResultsView'

export function App() {
  const test = useTraitTest()
  const generator = useDescriptionGenerator()
  const { state } = test

  // Load model in background while user takes test
  function handleStart() {
    test.start()
    generator.preload()
  }

  // Submit is disabled by default and only enabled after all 50 statements are rated
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

  function handleDownload() {
    if (!state.results) return
    console.log('Downloading TRAITS.md file...')
    recordDownload()
    downloadMarkdown(state.results, state.description)
  }

  return (
    <>
      {test.showResults && state.results ? (
        <ResultsView
          results={state.results}
          description={state.description}
          onDownload={handleDownload}
        />
      ) : (
        <>
          <Header />
          <main
            className="mx-4 my-6 flex flex-1 flex-col gap-8 md:my-12 md:max-lg:mx-6 lg:mx-8 lg:grid
              lg:grid-cols-[minmax(0,5fr)_minmax(18rem,4fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8
              lg:gap-y-6"
          >
            <h2
              className="text-center text-[1.375rem] font-normal text-mist-300/80 italic
                max-sm:mx-auto sm:pl-1 sm:text-2xl md:hidden"
            >
              Let your agent get acquainted with you
            </h2>
            <IntroCard />
            <div className="min-w-0 text-justify lg:col-start-1 lg:row-span-2 lg:row-start-1">
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
            <HowItWorksAccordion />
          </main>
        </>
      )}
      <Footer />
    </>
  )
}
