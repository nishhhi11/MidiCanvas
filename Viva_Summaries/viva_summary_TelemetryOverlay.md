# FILE SUMMARY: src/components/editor/TelemetryOverlay.jsx

## Purpose
Displays an informational footer bar with metrics (total notes, playing voices) and the cursor's exact time location over the canvas.

## React Concepts Used
- `useEffect` for subscribing to non-React DOM events.
- Independent state updates for performance optimization.

## Browser APIs Used
- `window.addEventListener` and `CustomEvent`.

## Most Likely Viva Questions
1. Why do you use a custom window event (`piano-pointer-move`) instead of just passing a `setPointerTime` callback down to the canvas?

## Expected Answers
1. The canvas registers mouse movements constantly (dozens of times a second). If we passed a state setter down, it would cause the massive parent component to re-render every time the mouse moved a single pixel, devastating performance. By emitting a custom DOM event on the `window`, we completely bypass the React component tree. Only this tiny Telemetry overlay listens for it and re-renders itself independently.
