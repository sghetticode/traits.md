export function Header() {
  return (
    <header
      className="relative w-auto h-fit min-h-16 mt-4 mx-4 flex flex-col gap-1 pt-2 pb-1
        pl-4 bg-mist-600/80 text-mist-300/85 rounded-[20px] border-b border-l
        border-mist-500/80 shadow-md shadow-mist-900/50 sm:flex-row sm:items-baseline sm:gap-0
        lg:pt-4 lg:pb-3"
    >
      <h1
        className="text-center text-[2.75rem] font-medium pr-3 lg:pr-4 lg:text-left lg:text-6xl"
      >
        TRAITS.md
      </h1>
      <h2
        className="italic tracking-wide max-md:hidden md:text-[1.375rem] lg:text-[1.875rem]"
      >
        Let your agent get acquainted with you
      </h2>
    </header>
  )
}
