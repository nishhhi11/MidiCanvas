# FILE SUMMARY: src/components/editor/VerticalKeyboard.jsx

## Purpose
The vertical keyboard axis for the Piano Roll grid, rendering white and black keys.

## Data Flow
`currentNotes` prop (from parent) -> `Set` -> Determines `isActive` -> Passes to `WhiteKey`/`BlackKey` components.
User Clicks -> `handleMouseDown` -> `inputManager.handleNoteOn`.

## React Concepts Used
- Dynamic rendering of lists (`.map`).
- Event handler passing.

## Most Likely Viva Questions
1. Why send the note event to `inputManager` instead of directly triggering Tone.js?

## Expected Answers
1. The `inputManager` acts as a central hub for all musical input (Mouse Clicks, QWERTY Keyboard, MIDI Controllers). Routing the click through there ensures that the exact same logic (triggering audio, recording the note, updating the UI) happens consistently regardless of the input source.
