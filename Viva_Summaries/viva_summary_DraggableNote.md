# FILE SUMMARY: src/components/editor/DraggableNote.jsx

## Purpose
The interactive visual representation of a single MIDI event. Handles its own drag-and-drop mechanics before committing changes to the global state.

## Data Flow
Props (time/duration) -> Base Pixels -> Drag Occurs -> Mutate Local Pixels -> Pointer Up -> Math conversion back to time/duration -> `onUpdate` callback -> Zustand State -> Re-render Props.

## React Concepts Used
- `React.memo` to prevent re-renders when parent state changes.
- Local component state (`useState`) for drag mechanics.
- Optimistic UI updates.

## Browser APIs Used
- Pointer Events API (`onPointerDown`, `onPointerMove`, `onPointerUp`).
- Pointer Capture (`setPointerCapture`, `releasePointerCapture`) to maintain lock during fast drags.

## Most Likely Viva Questions
1. Why is this component wrapped in `React.memo`?
2. Explain the math behind converting an X-pixel coordinate into a musical time value.
3. Why do you use `e.target.setPointerCapture`?

## Expected Answers
1. The Piano Roll might render thousands of these note components simultaneously. During playback, the global `currentTime` changes 60 times a second. If the parent `PianoRollCanvas` re-renders, it would normally force all thousand notes to re-render, causing massive lag. `React.memo` tells React to skip re-rendering this component unless its specific props (like `isSelected` or `isPlaying`) have changed.
2. The canvas relies on a `pixelsPerSecond` zoom ratio. If a note is moved by 100 pixels (`deltaX`), and our zoom is 50 `pixelsPerSecond`, we divide `100 / 50` to get `2`. We then add 2 seconds to the note's original start `time`. For pitch (Y-axis), we divide `deltaY` by the constant `ROW_HEIGHT` to find how many semi-tones the note shifted up or down.
3. When dragging a small element quickly, the user's mouse cursor might accidentally move off the element. If that happens, the element stops receiving `pointermove` events, and the drag stops unexpectedly. `setPointerCapture(pointerId)` forces all subsequent mouse events to be routed to this specific element, even if the cursor leaves its physical boundaries, until we release the capture on `pointerup`.
