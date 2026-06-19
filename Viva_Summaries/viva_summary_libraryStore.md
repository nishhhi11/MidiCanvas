# FILE SUMMARY: src/stores/libraryStore.js

## Purpose
Manages the application's local persistence layer (IndexedDB) and provides a global Zustand store for components to interact with the Library data.

## React Concepts Used
- Global state management (Zustand).

## JavaScript Concepts Used
- IndexedDB wrapper (Dexie).
- Asynchronous data fetching.

## Most Likely Viva Questions
1. Why do you call `await get().fetchSavedFiles()` after saving or deleting a file?

## Expected Answers
1. This ensures that the Zustand state (`savedFiles`) stays perfectly in sync with the actual data in IndexedDB. Instead of manually pushing or splicing the `savedFiles` array in memory, re-fetching guarantees we have the exact source of truth from the database, preventing UI mismatches.
