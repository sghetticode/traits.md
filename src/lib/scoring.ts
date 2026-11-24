import { factors, type Factor, type FactorResults } from '@/data/factors'
import { items as allItems, type Item } from '@/data/items'
import type { Rating } from '@/data/ratings'

// A user's answers so far, keyed by canonical Item.id
export type Answers = Record<number, Rating>

// IPIP plus key item scores
const plusScores: Record<Rating, number> = {
  'way off': 1,
  inaccurate: 2,
  neither: 3,
  accurate: 4,
  'spot on': 5,
}

// IPIP minus key item scores
const minusScores: Record<Rating, number> = {
  'way off': 5,
  inaccurate: 4,
  neither: 3,
  accurate: 2,
  'spot on': 1,
}

// Calculate trait test results for each factor. No logging or storage, caller does both.
export function gradeTest(answers: Answers, items: Item[] = allItems): FactorResults {
  const itemsById = new Map(items.map((item) => [item.id, item]))

  const totals = {} as Record<Factor, number>
  for (const factor of factors) totals[factor] = 0

  for (const [id, rating] of Object.entries(answers)) {
    const item = itemsById.get(Number(id))
    if (item === undefined) continue

    const scoreMap = item.sign === '+' ? plusScores : minusScores
    totals[item.factor] += scoreMap[rating]
  }

  // Populate results obj with total, average, and pomp for each factor
  const results = {} as FactorResults

  // Scores for each factor: total (raw score), average (mean score), pomp (POMP score)
  for (const factor of factors) {
    const total = totals[factor]
    results[factor] = { total, average: total / 10, pomp: 2.5 * (total - 10) }
  }

  return results
}

// Ranges for factor POMP scores
export type Range = 'Low end' | 'Low range' | 'Moderate' | 'High range' | 'High end'

// Normalize raw percentages to 2.5% steps
function snapPercentage(pomp: number): number {
  const units = Math.round(pomp / 2.5)
  return units * 2.5
}

// Format as whole percentages otherwise one decimal
export function formatPercentage(pomp: number): string {
  const value = snapPercentage(pomp)
  const displayCents = Math.round(value * 100)
  if (displayCents % 100 === 0) return `${displayCents / 100}%`
  return `${(displayCents / 100).toFixed(1)}%`
}

// Map factor POMP scores to ranges
export function setRange(percentage: number): Range {
  const percent = snapPercentage(percentage)
  if (percent < 12.5) return 'Low end'
  if (percent < 37.5) return 'Low range'
  if (percent < 62.5) return 'Moderate'
  if (percent < 87.5) return 'High range'
  return 'High end'
}

export function logResults(results: FactorResults) {
  console.log('Trait test results:')
  console.table(
    factors.map((factor) => ({
      factor,
      total: results[factor].total,
      average: results[factor].average,
      pomp: results[factor].pomp,
    })),
  )
}

export function answeredCount(answers: Answers): number {
  return Object.keys(answers).length
}

// Block incomplete submissions until all items have ratings
export function isComplete(answers: Answers): boolean {
  return answeredCount(answers) === allItems.length
}
