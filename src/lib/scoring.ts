import { factors, type Factor, type FactorResults } from '@/factors'
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

// Calculate trait test results for each factor. Pure: no logging or storage, the caller does both
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

  // Populate results obj with total and percentage for each factor
  const results = {} as FactorResults

  for (const factor of factors) {
    const total = totals[factor]
    results[factor] = { total, percentage: ((total - 10) / 40) * 100 }
  }

  return results
}

// Same console output as the original gradeTest
export function logResults(results: FactorResults) {
  console.log('Trait test results:')
  console.table(
    factors.map((factor) => ({
      factor,
      total: results[factor].total,
      percentage: results[factor].percentage,
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
