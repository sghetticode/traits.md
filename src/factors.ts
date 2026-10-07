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
    'intellect-imagination': 'Intellect/Imagination',
}

export interface FactorResult {
    total: number
    percentage: number
}

export type FactorResults = Record<Factor, FactorResult>

// Interpretive levels for factor percentages
export type Level = 'Sparse' | 'Low' | 'Moderate' | 'High' | 'Dense'

// Matches gradeTest() calculation (steps of 2.5%)
const FACTOR_PERCENT_STEP = 2.5

// Normalize raw percentages to the 2.5% steps produced by gradeTest
export function snapPercentage(percentage: number): number {
    const units = Math.round(percentage / FACTOR_PERCENT_STEP)
    return units * FACTOR_PERCENT_STEP
}

// Snap and format for display (whole percentages else one decimal)
export function formatPercentage(percentage: number): string {
    const value = snapPercentage(percentage)
    const displayCents = Math.round(value * 100)
    if (displayCents % 100 === 0) return `${displayCents / 100}%`
    return `${(displayCents / 100).toFixed(1)}%`
}

// Map to interpretive levels: sparse, low, moderate, high, dense
export function levelFor(percentage: number): Level {
    const percent = snapPercentage(percentage)
    if (percent < 20) return 'Sparse'
    if (percent < 40) return 'Low'
    if (percent < 60) return 'Moderate'
    if (percent < 80) return 'High'
    return 'Dense'
}
