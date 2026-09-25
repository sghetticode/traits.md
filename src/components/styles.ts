// Plain Tailwind replacements for daisyUI classes the vanilla app used in more than one place

// daisyUI `table`: separated borders, left-aligned text, cell padding, semibold header, and a divider
// under the header row and every body row but the last. Each table adds its own divider color
export const tableClass =
  'w-full border-separate border-spacing-0 text-left [&_thead]:font-semibold [&_thead]:whitespace-nowrap [&_tr>*]:px-4 [&_tr>*]:py-3 [&_tr>*]:align-middle [&_thead_tr>*]:border-b [&_tbody_tr:not(:last-child)>*]:border-b'

// daisyUI `btn btn-ghost`, layered over shadcn's Button: pointer cursor, semibold text with a faint
// highlight, and disabled buttons fade only their text (shadcn fades the whole button to 50%)
export const buttonClass =
  'cursor-pointer font-semibold text-shadow-[0_0.5px_oklch(100%_0_0/0.15)] disabled:opacity-100 disabled:text-glacier/20'
