export function Header() {
  return (
    <header
      className="relative mx-9 mt-6 flex h-fit min-h-16 w-auto flex-col gap-1 rounded-[20px]
        border-b border-l border-mist-500/80 bg-mist-600/80 pt-2 pb-1 pl-4 text-mist-300/85
        shadow-md shadow-mist-900/50 sm:flex-row sm:items-baseline sm:gap-0 lg:pt-4 lg:pb-3"
    >
      <h1 className="pr-3 text-center text-[2.75rem] font-medium max-md:flex-1 lg:pr-4 lg:text-6xl">
        TRAITS.md
      </h1>
      <h2 className="tracking-wide italic max-md:hidden md:text-[1.375rem] lg:text-[1.875rem]">
        Let your agent get acquainted with you
      </h2>
    </header>
  )
}
