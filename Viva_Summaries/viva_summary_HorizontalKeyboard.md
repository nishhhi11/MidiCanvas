# FILE SUMMARY: src/components/editor/HorizontalKeyboard.jsx

## Purpose
A full 88-key interactive piano component capable of playing audio via Tone.js directly.

## React Concepts Used
- Heavy use of `useMemo` to prevent recalculating the layout of 88 keys on every render.
- CSS Absolute Positioning for dynamic black key placement over CSS Flexbox for white keys.

## Most Likely Viva Questions
1. Why do you wrap the `activeMidiSet` in `useMemo`?
2. Explain how the black keys are positioned exactly between the white keys.

## Expected Answers
1. `activeNotes` is an array of objects passed down as props, which updates frequently during playback. Creating a `Set` takes O(N) time. By using `useMemo`, we only recreate the Set when the `activeNotes` array actually changes, rather than on every single React render cycle. We use a Set instead of an Array for O(1) lookup time during the rendering of the 88 individual keys.
2. The white keys are rendered using a CSS flexbox (`flex-1`), meaning they automatically divide the container width equally. For the black keys, we calculate their position using percentages. We determine how many white keys come *before* the black key. We multiply that count by the percentage width of a single white key to find the exact pixel coordinate of the gap. We then set the black key's `left` CSS property to that gap, minus half of the black key's own width to perfectly center it.
