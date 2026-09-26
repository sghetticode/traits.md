import { useState } from 'react'
import type { FactorResults } from '@/factors'
import { generateDescription, preloadGenerator } from '@/generator'

// Wraps the in-browser language model. Call preload and generate from event handlers only, never
// from an effect: generateDescription rejects any earlier pending call, so StrictMode running an
// effect twice would cancel the first request and silently fall back to table-only results
export function useDescriptionGenerator() {
  // Status line shown under the spinner ("Downloading model... 42%", "Generating description...")
  const [progressText, setProgressText] = useState('')

  return {
    progressText,
    preload: preloadGenerator,
    generate: (results: FactorResults) => generateDescription(results, setProgressText),
  }
}
