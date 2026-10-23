export function IntroCard() {
  return (
    <div
      id="intro"
      className="relative flex flex-col rounded-2xl bg-mist-500/75 shadow-sm shadow-mist-800/50
        md:max-lg:w-2/3 md:max-lg:mx-auto lg:col-start-2 lg:row-start-1 lg:rounded-b-md"
    >
      <p
        className="px-5 py-4 text-justify text-[1.25rem] leading-tight font-light tracking-tight
          lg:text-[1.375rem]"
      >
        <span className="font-normal">Traits</span> help your agent adapt to you, by using
        test results to generate an accurate description of your personality. Keep reading to learn
        how it works or take the trait test to get started now!
      </p>
    </div>
  )
}
