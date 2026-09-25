import { Accordion as AccordionPrimitive } from 'radix-ui'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full overflow-hidden rounded-2xl bg-mist-500/75 p-1 text-lg shadow-sm
        shadow-mist-800/50 lg:col-start-2 lg:row-start-2 lg:self-start lg:rounded-t-md"
    >
      <Accordion
        type="single"
        collapsible
        onValueChange={(value) => {
          console.log(`How it works section ${value ? 'expanded' : 'collapsed'}`)
        }}
      >
        <AccordionItem value="how-it-works">
          {/* Custom trigger: shadcn's shows a chevron, this keeps the original +/− */}
          <AccordionPrimitive.Header className="lg:text-[1.375rem] xl:text-2xl">
            <AccordionPrimitive.Trigger
              className="group focus-visible:ring-ring/50 relative w-full cursor-pointer p-4 pe-12
                text-left outline-none focus-visible:ring-3"
            >
              How it works
              <PlusIcon
                aria-hidden
                className="absolute end-5 top-1/2 size-[0.75em] -translate-y-1/2
                  group-aria-expanded:hidden"
              />
              <MinusIcon
                aria-hidden
                className="absolute end-5 top-1/2 hidden size-[0.75em] -translate-y-1/2
                  group-aria-expanded:block"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="pr-8 pb-4 pl-4 text-lg">
            <p
              className="border-l-[3px] border-l-mist-400/80 pl-4 text-justify leading-normal
                font-light lg:text-xl"
            >
              The results of this trait test are separated into five factors, known as the "Big
              Five" personality traits. Each will have a percentage associated with it based on
              statements you ranked as either way off, inaccurate, neither, accurate, or spot on.
              These values are passed to an LLM running in the browser to generate a description of
              your personality. Your results are saved to a Markdown file that's specific to you.
              Follow the instructions provided after you finish the test to use as intended.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
