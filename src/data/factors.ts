// Big Five personality factors
export const factors = [
  'extraversion',
  'agreeableness',
  'conscientiousness',
  'emotional-stability',
  'intellect-imagination',
] as const

export type Factor = (typeof factors)[number]

// Map factor keys to display names
export const factorNames: Record<Factor, string> = {
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  conscientiousness: 'Conscientiousness',
  'emotional-stability': 'Emotional Stability',
  'intellect-imagination': 'Intellect-Imagination',
}

export type FactorResults = Record<Factor, FactorResult>

export interface FactorResult {
  total: number // raw score
  average: number // average response
  pomp: number // percentage of max possible
}
