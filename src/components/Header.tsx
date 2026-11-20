interface HeaderProps {
  results?: boolean
}

export function Header({ results = false }: HeaderProps) {
  if (results) {
    return (
      <header
        id="results-header"
        className="mt-6 flex h-fit min-h-18 items-center justify-center rounded-2xl border-b
          border-l border-mist-400/40 bg-mist-500/80 px-6 shadow-sm shadow-mist-900/50 md:max-w-lg"
      >
        <h2 className="text-2xl font-medium tracking-wider text-mist-300/80 lg:text-[1.625rem]">
          Your Personality Test Results
        </h2>
      </header>
    )
  } else {
    return (
      <header
        id="main-header"
        className="relative mx-10 mt-5 flex h-auto min-h-16 w-auto flex-col gap-1 rounded-[20px]
          border-b border-l border-mist-500/80 bg-mist-600/80 pt-2 pb-1 pl-4 text-mist-300/85
          shadow-md shadow-mist-900/50 sm:flex-row sm:items-baseline sm:gap-0 lg:mx-8 lg:pt-4
          lg:pb-3"
      >
        <h1
          className="pr-3 text-center text-[2.75rem] font-medium max-md:flex-1 lg:pr-4 lg:text-6xl"
        >
          TRAITS.md
        </h1>
        <h2 className="tracking-wide italic max-md:hidden md:text-[1.375rem] lg:text-[1.875rem]">
          Let your agent get acquainted with you
        </h2>
      </header>
    )
  }
}
