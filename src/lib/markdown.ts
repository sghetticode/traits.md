import { factors, factorNames, levelFor, type FactorResults } from '@/factors'

// Build results file with table and personality description
export function buildMarkdown(results: FactorResults, description: string | null): string {
  const lines = factors
    .map((factor) => {
      const name = factorNames[factor].padEnd(21)
      const percent = `${Math.round(results[factor].percentage)}%`.padEnd(7)
      const level = levelFor(results[factor].percentage).padEnd(8)
      return `| ${name} | ${percent} | ${level} |`
    })
    .join('\n')

  let markdown = `# TRAITS.md

| Factor                | Percent | Level    |
| --------------------- | ------- | -------- |
${lines}
`

  if (description) markdown += `\n${description}\n`

  return markdown
}

// Create object URL blob and trigger browser download of results Markdown
export function downloadResults(results: FactorResults, description: string | null) {
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
