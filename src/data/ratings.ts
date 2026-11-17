// Rating options for every test item in column order

export const RATINGS = [
  { value: 'way off', label: 'Way off' },
  { value: 'inaccurate', label: 'Inaccurate' },
  { value: 'neither', label: 'Neither' },
  { value: 'accurate', label: 'Accurate' },
  { value: 'spot on', label: 'Spot on' },
] as const

export type Rating = (typeof RATINGS)[number]['value']
