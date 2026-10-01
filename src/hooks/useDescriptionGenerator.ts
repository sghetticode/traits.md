import { useState } from 'react'
import type { FactorResults } from '@/factors'
import { generateDescription, preloadGenerator } from '@/generator'

// Wraps Transformers.js model

/* Call preload and generate from event handlers only, never from an effect
 * generateDescription rejects any earlier pending call, so StrictMode running an
 * effect twice would cancel first request and silently fall back to table-only results */

export function useDescriptionGenerator() {
  // Status line shown under spinner ("Downloading model..., "Generating description...")
  const [progressText, setProgressText] = useState('')
  // True while a generation is in flight, so callers can ignore clicks that would overlap it
  const [busy, setBusy] = useState(false)

  async function generate(results: FactorResults) {
    setBusy(true)
    try {
      return await generateDescription(results, setProgressText)
    } finally {
      setBusy(false)
    }
  }

  return {
    progressText,
    busy,
    preload: preloadGenerator,
    generate,
  }
}
