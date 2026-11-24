# Source map

React + shadcn/ui app built with Vite. `index.html` loads `/src/main.tsx`, which renders the App
inside <StrictMode> into #root. Display: contents, so the header, main, and footer still lay out 
in the body's flex column. Top-level flow lives in `App.tsx`: intro and test UI until submit
grades the answers then shows `ResultsView`.

| Module                                 | Role                                                                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `hooks/useTraitTest.ts`                | Test state: pure reducer (page, answers, scoring, results), actions, and persistence via `lib/storage`                      |
| `hooks/useDescriptionGenerator.ts`     | LLM status for the UI (`preload`, `generate`, `progressText`); calls stay in event handlers, not effects                    |
| `generator.ts` + `generator.worker.ts` | In-browser LLM pipeline: `@huggingface/transformers` runs in a Web Worker                                                   |
| `lib/scoring.ts`                       | Pure IPIP scoring: answers to factor totals and percentages, POMP range snapping, and display formatting                    |
| `lib/storage.ts`                       | localStorage session: answers and results survive reload, clears an hour after download                                     |
| `lib/exportMarkdown.ts`                | Builds the TRAITS.md results file and triggers the download                                                                 |
| `lib/utils.ts`                         | Re-exports `cn` (npm package) per the shadcn convention                                                                     |
| `components/`                          | App UI, mostly presentational; state lives in the hooks.                                                                    |
| `components/ui/`                       | shadcn primitives: not a dependency. `components.json` is the CLI manifest; re-add with `npx shadcn add` and re-apply edits |
| `data/factors.ts`                      | Big Five factor keys and display names                                                                                      |
| `data/items.ts`, `data/ratings.ts`     | The 50 IPIP items in display order and the five rating options; rating `value`s must not change                             |

## Conventions

- To inspect the current generation run, open browser developer tools under Application/Storage ->
  Local Storage. `descDraft1`, `descDraft2`, and `descDraft3` each contain a JSON object with
  the draft text, grade, and displayed status. These keys follow the session's
  existing cleanup policy after download.
- Pages are a manual router: 0 instructions, 1-10 items, 11 submit (`LAST_PAGE` in `data/items.ts`).
- `@/` aliases `src/` (`vite.config.ts`). Files in `components/ui/` import `cn` from the package
  directly, not `@/lib/utils`.
- `vite.config.ts` sets COOP/COEP headers on the dev server because `@huggingface/transformers`
  needs SharedArrayBuffer. Keep them.
- `"use client"` in some `ui/` files is a leftover Next.js directive; it does nothing under Vite.
- Styling is layered: `@import 'shadcn/tailwind.css'` (palette and defaults) -> `:root`/`@theme inline`
  semantic tokens in `style.css` -> one-off utilities.
