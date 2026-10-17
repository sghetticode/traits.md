import { factors, factorNames, formatPercentage, type FactorResults } from '@/factors'

// Build traits Markdown file with Frontmatter
export function buildMarkdown(results: FactorResults, description: string | null): string {
  const lines = factors
    .map((factor) => {
      const name = factorNames[factor]
      const score = results[factor].average
      const pomp = formatPercentage(results[factor].percentage)
      return `  ${name}: ${score}/5 (${pomp})`
    })
    .join('\n')

  const frontmatter = `---\ntraits:\n${lines.toLowerCase()}\n---`

  let markdown = frontmatter + `\n
# TRAITS.md

## Agent Instructions

Use the personality description and the trait test scores in this file's Frontmatter to shape your
interactions to the person you're working with.

### Personality Description
`

  if (description) markdown += `\n${description}\n`

  return markdown
}

// Create object URL blob and trigger download of TRAITS.md file
export function downloadMarkdown(results: FactorResults, description: string | null) {
  const blob = new Blob([buildMarkdown(results, description)], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'TRAITS.md'
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
