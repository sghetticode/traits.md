import { Accordion as AccordionPrimitive } from 'radix-ui'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'

export function HowItWorksAccordion() {
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
          {/* Custom trigger replaces shadcn's chevron with a plus/minus sign */}
          <AccordionPrimitive.Header className="lg:text-[1.375rem] xl:text-2xl">
            <AccordionPrimitive.Trigger
              className="group focus-visible:ring-ring/50 relative w-full cursor-pointer p-4 pe-12
                text-left outline-none focus-visible:ring-3"
            >
              How it works
              <PlusIcon
                aria-hidden
                className="absolute inset-e-5 top-1/2 size-[0.75em] -translate-y-1/2
                  group-aria-expanded:hidden"
              />
              <MinusIcon
                aria-hidden
                className="absolute inset-e-5 top-1/2 hidden size-[0.75em] -translate-y-1/2
                  group-aria-expanded:block"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="pr-8 pb-4 pl-4 text-lg">
            <p
              className="border-l-[3px] border-l-mist-400/80 pl-4 text-justify leading-normal
                font-light lg:text-xl"
            >
              The results of the trait test are separated into five factors, known as
              the "Big Five" personality traits (extraversion, agreeableness, conscientiousness,
              emotional stability, and intellect/imagination). This is a 50-item IPIP version of
              Goldberg’s markers for the Big-Five factors. Your trait scores are passed to a
              local model running in the browser to generate a description of your personality.
              Your results are specific to you and can be downloaded as a TRAITS.md file. Follow
              the steps on the results page to use your trait data effectively.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
