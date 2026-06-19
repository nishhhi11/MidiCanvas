# FILE SUMMARY: src/hooks/usePianoRoll.js

## Purpose
Provides UI math (`zoomLevel`, `pixelsPerSecond`), snapping/quantization logic, and keyboard shortcut event listeners for the main Piano Roll editor.

## React Concepts Used
- `useRef` for container scrolling.
- Global window event listeners via `useEffect`.

## Most Likely Viva Questions
1. Explain how the Y-axis inversion works for the `rows` array.
2. How does `pixelsPerSecond` relate to `zoomLevel`?

## Expected Answers
1. HTML Canvas and standard web DOM rendering use a Y-axis that starts at `0` at the *top* of the screen and grows downward. However, in musical notation and piano rolls, lower pitches are always at the *bottom*. By calculating `(TOTAL_KEYS - 1 - i) * ROW_HEIGHT`, we invert the rendering coordinate so that the lowest MIDI note (21) renders at the largest Y pixel value (the bottom).
2. It serves as the core mathematical multiplier for the entire X-axis of the application. At a zoom level of 1, 1 second of audio = 100 pixels wide. If zoom is 2, the multiplier is 200, so a 5-second MIDI clip goes from 500 pixels to 1000 pixels wide, physically expanding the scrollable width of the `totalWidth` canvas.
