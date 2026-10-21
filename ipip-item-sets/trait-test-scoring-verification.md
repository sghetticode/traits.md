# Trait test scoring verification

## Display formatting

`formatPercentage()` in `src/factors.ts` snaps raw percentages to 2.5% steps via `snapPercentage()`
(same step size as `gradeTest()`), then formats them for display (whole percents when exact,
otherwise one decimal). The results table and downloaded `TRAITS.md` frontmatter both use that
formatted value; the UI table columns are `Factor | Percent`.

## On submit `gradeTest()` does the following

`gradeTest()` in `src/lib/scoring.ts` grades the 50 answers (keyed by item `id`) and returns the
scores for each factor. The test state hook saves them to localStorage as `results`.

- **Scoring (official IPIP +/- key)** Plus items: `way off` = 1, `inaccurate` = 2, `neither` = 3, 
`accurate` = 4, `spot on` = 5; Minus items (reverse): `way off` = 5... `spot on` = 1
- **Totals** per factor = sum of its 10 scored items (range 10-50)
- **Percentage** per factor = `(total - 10) / 40 * 100` (range 0-100%)
- Item factor and key direction come from `src/data/items.ts`, where each item has a canonical
`id` (its number in `ipip-50-item-scale.md`), `factor` and `sign` (e.g.
`{ id: 6, text: "Don't talk a lot.", factor: 'extraversion', sign: '-' }`)

## After scoring, `ResultsView` does the following

Once `results` is set and scoring has finished, the app replaces the landing page with
`src/components/ResultsView.tsx`, which renders the results table (and the description, if one
was generated).

## Plus/minus item keys

| Factor                      | + items | - items |
| --------------------------- | ------- | ------- |
| Extraversion (EXT)          | 5       | 5       |
| Agreeableness (AGR)         | 6       | 4       |
| Conscientiousness (CON)     | 6       | 4       |
| Emotional Stability (ES)    | 2       | 8       |
| Intellect/Imagination (II)  | 7       | 3       |

### Expected console output shape

```JavaScript
Trait Test Results: {
  'extraversion': { total: 10-50, percentage: 0-100 },
  'agreeableness': { total: 10-50, percentage: 0-100 },
  'conscientiousness': { total: 10-50, percentage: 0-100 },
  'emotional-stability': { total: 10-50, percentage: 0-100 },
  'intellect-imagination': { total: 10-50, percentage: 0-100 }
}
```

Plus a `console.table` rendering of the same data; example shows an all-"Neither" run

### Test area 1: Uniform runs

Answer all 50 items the same way for a quick end-to-end check. Expected `{ total, percentage }`
per factor (`total / formatted %`):

| All items answered | EXT        | AGR        | CON        | ES         | II         |
| ------------------ | ---------- | ---------- | ---------- | ---------- | ---------- |
| **Way off**        | 30 / 50%   | 26 / 40%   | 26 / 40%   | 42 / 80%   | 22 / 30%   |
| **Inaccurate**     | 30 / 50%   | 28 / 45%   | 28 / 45%   | 36 / 65%   | 26 / 40%   |
| **Neither**        | 30 / 50%   | 30 / 50%   | 30 / 50%   | 30 / 50%   | 30 / 50%   |
| **Accurate**       | 30 / 50%   | 32 / 55%   | 32 / 55%   | 24 / 35%   | 34 / 60%   |
| **Spot on**        | 30 / 50%   | 34 / 60%   | 34 / 60%   | 18 / 20%   | 38 / 70%   |

Sanity properties to eyeball:

- EXT is always 30/50% (perfectly balanced 5+/5-)
- "Way off" and "Spot on" rows mirror each other (per-factor totals add to 60)
- ES swings opposite to II (ES is minus-heavy, II is plus-heavy) that's the reversal logic working

### Test area 2: Single-factor isolation

Confirms each factor's items route to the right bucket with the right key mix.
Answer the target factor's items one way, everything else "Neither".

Target factor all **Spot on** (others all "Neither", i.e. 50%):

| Target factor         | Expected target result | Other 4 factors      |
| --------------------- | ---------------------- | -------------------- |
| Extraversion          | 30 / 50%               | all 30 / 50%         |
| Agreeableness         | 34 / 60%               | all 30 / 50%         |
| Conscientiousness     | 34 / 60%               | all 30 / 50%         |
| Emotional Stability   | 18 / 20%               | all 30 / 50%         |
| Intellect/Imagination | 38 / 70%               | all 30 / 50%         |

Target factor all **Way off** (others all "Neither", i.e. 50%):

| Target factor         | Expected target result | Other 4 factors      |
| --------------------- | ---------------------- | -------------------- |
| Extraversion          | 30 / 50%               | all 30 / 50%         |
| Agreeableness         | 26 / 40%               | all 30 / 50%         |
| Conscientiousness     | 26 / 40%               | all 30 / 50%         |
| Emotional Stability   | 42 / 80%               | all 30 / 50%         |
| Intellect/Imagination | 22 / 30%               | all 30 / 50%         |

Each item's `factor` and `sign` are listed in `src/data/items.ts`, so you can find which items
belong to a factor there. The number shown in the app is the item's position in that array.

### Test area 3: Single-item flips

Cleanest unit test of +/- scoring on known items. The numbers below are canonical `id`s from
`src/data/items.ts`; in the app, items 1, 2 and 4 are shown as #46, #47 and #49.
Baseline: all items "Neither" (every factor 30 / 50%). Change exactly one item:

| Flip                                                        | Expected change | Expected factor result |
| ----------------------------------------------------------- | --------------- | ---------------------- |
| #1 "Am the life of the party." (EXT **+**) -> Spot on       | EXT +2          | 32 / 55%               |
| #1 -> Way off                                               | EXT -2          | 28 / 45%               |
| #2 "Feel little concern for others." (AGR **-**) -> Spot on | AGR **-2**      | 28 / 45%               |
| #2 -> Way off                                               | AGR **+2**      | 32 / 55%               |
| #4 "Get stressed out easily." (ES **-**) -> Spot on         | ES -2           | 28 / 45%               |

If minus-keyed factors move in the wrong direction, then they're not being reversed correctly.

### Test area 4: Boundary checks

Requires answering by item key direction:

- Every **+** item "Spot on" and every **-** item "Way off" -> every factor **50 / 100%**
- Inverse (- "Spot on", + "Way off") -> every factor **10 / 0%**
