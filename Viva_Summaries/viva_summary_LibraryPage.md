# FILE SUMMARY: src/pages/LibraryPage.jsx

## Purpose
The page component that displays all saved MIDI files from IndexedDB. It handles sorting, searching, and loading files back into the editor.

## React Concepts Used
- Hooks (`useState`, `useMemo`), Routing (`useNavigate`), and Global State (`useLibraryStore`).

## Most Likely Viva Questions
1. Why use `useMemo` here for `filteredFiles`?

## Expected Answers
1. Because sorting an array of objects is computationally expensive. By wrapping the filter and sort logic in `useMemo`, we ensure this calculation only runs when `savedFiles`, `searchQuery`, or `sortBy` actually change. If the component re-renders for any other reason, it skips the expensive sort and returns the cached array.
