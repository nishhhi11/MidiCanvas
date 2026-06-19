# FILE SUMMARY: src/hooks/useIndexedDB.js

## Purpose
Connects components to the global IndexedDB Library store while ensuring the data is automatically hydrated on mount.

## React Concepts Used
- `useEffect` for side-effects on mount.
- Hook Composition (calling a Zustand hook inside a custom React hook).

## Most Likely Viva Questions
1. Why is `fetchSavedFiles` inside the dependency array of this `useEffect`?

## Expected Answers
1. React's exhaustive-deps rule requires all functions from component/hook scope used inside an effect to be declared as dependencies. If `fetchSavedFiles` were ever recreated (e.g., if the store implementation changed), the effect would safely re-run with the new function reference. Since Zustand guarantees stable function references, it effectively acts as an "on mount" `[]` dependency array but satisfies the linter safely.
