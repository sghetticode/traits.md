/*
  Response options for every test item in column order
  The `value` gets stored and scored, so keep them as is
*/
export const RATINGS = [
  {
    value: 'way off',
    label: 'Way off',
    color: 'bg-red-800/60',
    border: 'border-red-900/70',
    header: 'text-red-800/60',
  },
  {
    value: 'inaccurate',
    label: 'Inaccurate',
    color: 'bg-amber-700/60',
    border: 'border-amber-800/70',
    header: 'text-amber-700/60',
  },
  {
    value: 'neither',
    label: 'Neither',
    color: 'bg-gray-600/70',
    border: 'border-gray-700/80',
    header: 'text-gray-600/80',
  },
  {
    value: 'accurate',
    label: 'Accurate',
    color: 'bg-cyan-700/60',
    border: 'border-cyan-800/70',
    header: 'text-cyan-700/70',
  },
  {
    value: 'spot on',
    label: 'Spot on',
    color: 'bg-green-800/60',
    border: 'border-green-900/70',
    header: 'text-green-800/70',
  },
] as const

/*
  Radix radios are btns with data-state="checked" not inputs
  This uses data-checked in place of the native checked
*/
export const CHECKED_FILL = 'data-checked:text-neutral-100/80'
export type Rating = (typeof RATINGS)[number]['value']
