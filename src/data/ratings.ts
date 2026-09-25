// Response options for every item, in column order. `value` is what gets stored and scored, so these
// strings must not change. Class strings are written out in full so Tailwind can find them
export const RATINGS = [
  {
    value: 'way off',
    label: 'Way off',
    color: 'bg-red-800/60',
    border: 'border-red-900/70',
    header: 'text-red-800/75',
  },
  {
    value: 'inaccurate',
    label: 'Inaccurate',
    color: 'bg-amber-700/60',
    border: 'border-amber-800/70',
    header: 'text-amber-700/75',
  },
  {
    value: 'neither',
    label: 'Neither',
    color: 'bg-gray-600/60',
    border: 'border-gray-700/70',
    header: 'text-gray-600/75',
  },
  {
    value: 'accurate',
    label: 'Accurate',
    color: 'bg-cyan-700/60',
    border: 'border-cyan-800/70',
    header: 'text-cyan-700/75',
  },
  {
    value: 'spot on',
    label: 'Spot on',
    color: 'bg-green-800/60',
    border: 'border-green-900/70',
    header: 'text-green-800/75',
  },
] as const

// Color of the selected radio's dot. Radix radios are buttons with data-state="checked", not
// inputs, so this uses the data-checked: variant where the native radio used checked:
export const CHECKED_FILL = 'data-checked:text-neutral-100/80'

export type Rating = (typeof RATINGS)[number]['value']
