# FILE SUMMARY: src/components/editor/WhiteKey.jsx

## Purpose
A simple UI component for a white piano key.

## React Concepts Used
- Props for dimensions, state, and event callbacks.

## Most Likely Viva Questions
1. Why do you handle `onMouseLeave` by calling `onMouseUp`?

## Expected Answers
1. If a user clicks a key down (`onMouseDown`), the note starts playing. If they drag their mouse completely off the key and release the click somewhere else, the key never registers an `onMouseUp` event, so the note plays infinitely (a stuck note). Tying `onMouseLeave` to `onMouseUp` prevents this bug by stopping the note as soon as the cursor leaves the element.
