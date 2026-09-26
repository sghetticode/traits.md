export function IntroCard() {
  return (
    <section id="intro" className="lg:col-start-2 lg:row-start-1">
      <div
        className="relative flex flex-col rounded-2xl bg-mist-500/75 shadow-sm shadow-mist-800/50
          lg:rounded-b-md"
      >
        <p
          className="px-5 py-4 text-justify text-lg leading-tight font-light tracking-tight
            lg:text-xl xl:text-[1.375rem]"
        >
          <span className="font-normal italic">Traits</span> help your agent adapt to you, by using
          results from a trait test to generate an accurate description of your personality. Read on
          to learn how it works or take the trait test to get started now!
        </p>
      </div>
    </section>
  )
}
