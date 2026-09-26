export function Footer() {
  return (
    <footer
      className="mt-auto grid h-fit w-full grid-flow-col-dense place-items-center gap-x-4 gap-y-10
        bg-mist-900/40 p-3 text-center text-sm text-neutral-300/75"
    >
      <aside className="grid place-items-center gap-2 text-sm">
        <h4 className="font-medium">YOUR DATA DOESN'T LEAVE YOUR DEVICE</h4>
        <p className="italic">
          Trait test data is temporarily stored in your browser. All of it is deleted shortly after
          you download your TRAITS.md file (~1 hour).
        </p>
      </aside>
    </footer>
  )
}
