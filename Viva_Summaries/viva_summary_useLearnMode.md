# FILE SUMMARY: src/hooks/useLearnMode.js

## Purpose
A custom hook that intercepts normal playback, analyzes the array of MIDI notes, and requires the user to match the pitch of the current note before advancing the cursor.

## React Concepts Used
- Derived state (calculating `targetPitch` and `expectedKey` during render instead of storing them in `useState`).
- `useEffect` for data hydration tracking.

## Most Likely Viva Questions
1. Why do you reset state when `rawNotes` changes?

## Expected Answers
1. `rawNotes` changes when a user uploads a new MIDI file. If we didn't reset the `currentNoteIndex` to 0, the Learn Mode might crash by trying to access an index (e.g., note 500) that doesn't exist in a shorter newly uploaded file.
