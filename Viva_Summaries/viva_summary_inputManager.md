# FILE SUMMARY: src/utils/inputManager.js

## Purpose
Routes real-time hardware/UI inputs to both the AudioEngine (for sound) and the Zustand store (for visual feedback).

## Most Likely Viva Questions
1. Why do you use a `Set` for `playedNotes` instead of an array?

## Expected Answers
1. A `Set` automatically guarantees uniqueness. If a user mashes the same key multiple times or if keyboard events fire rapidly (key repeat), we only want to track that the note is "currently pressed" once. `Set` lookups and deletions are also O(1) time complexity, making it highly efficient.
