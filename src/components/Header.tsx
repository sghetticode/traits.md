export function Header() {
  return (
    <header
      className="relative mx-4 flex h-fit min-h-16 w-auto flex-col items-start gap-1 rounded-b-4xl
        border-b-[1.5px] border-b-mist-800/75 bg-mist-600/60 py-3 pr-4 pl-5 sm:mx-6 sm:flex-row
        sm:items-baseline sm:gap-0 lg:mx-8"
    >
      <h1 className="text-4xl/none font-medium text-neutral-100/90 lg:text-6xl/none">TRAITS.md</h1>
      <span
        className="font-light text-mist-400/60 max-md:hidden md:pr-1 md:pl-2 md:text-3xl lg:pr-2
          lg:pl-3 lg:text-5xl"
      >
        /
      </span>
      <h2 className="font-normal text-neutral-100/80 max-md:hidden md:text-2xl lg:text-[1.75rem]">
        Let your agent get acquainted with you
      </h2>
    </header>
  )
}
