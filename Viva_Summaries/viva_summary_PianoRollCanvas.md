# FILE SUMMARY: src/components/editor/PianoRollCanvas.jsx

## Purpose
This is the core visual component of the Editor. It renders a 2D scrolling grid where the X-axis is time and the Y-axis is pitch (MIDI note numbers). It handles note rendering, dragging, resizing, zooming, and keyboard shortcuts.

## Data Flow
Receives `rawNotes` via props -> Maps them to `DraggableNote` components.
User drags note -> Calls `handleNoteUpdate` -> Calls `updateNote` in Zustand store -> Re-renders with new positions.

## Important Variables
- `zoomLevel`, `verticalZoomLevel`: Scales the X and Y axes mathematically.
- `snapDivision`: Determines if note movements snap to rhythmic grids (e.g. 1/4 or 1/8th notes).
- `selectedNoteIds`: A `Set` tracking highlighted notes for bulk operations (deletion).

## Important Functions
- `handleCanvasDoubleClick`: Calculates mouse coordinates to create a new note object and dispatch it to the store.
- `handleScroll`: Synchronizes the scrolling of the main grid with the vertical piano keyboard and the horizontal velocity lane.

## React Concepts Used
- `useState`, `useRef`, `useEffect`, `useCallback`.
- Lifting state up (passing callbacks to child `DraggableNote` components).
- DOM ref manipulation for synchronized scrolling.

## JavaScript Concepts Used
- Keyboard event listeners (`keydown`).
- `Set` operations for O(1) membership checking.
- Math operations for coordinate-to-time conversion.

## Browser APIs Used
- `getBoundingClientRect()` for precise mouse coordinate calculations within a scrolling container.
- `CustomEvent` for cross-component communication (pointer hover time).

## Performance Considerations
- **Set vs Array for lookups:** Checking `activeNoteIds.has(id)` is O(1). Doing this inside a map function over thousands of notes is significantly faster than using `.includes()` which is O(N).
- **Zustand `useShallow`:** Prevents the entire grid from re-rendering every time the audio engine updates the `currentTime`, because it only pulls specific setter functions from the store.

## Most Likely Viva Questions
1. Explain how the component converts a mouse click (X, Y) into a musical note (Time, Pitch).
2. Why do you use `useRef` for the containers and manually sync scrolling?
3. What is the time complexity of rendering notes?

## Tricky Follow-Up Questions
1. If the user zooms in while the playhead is playing, what happens to the UI?
2. What happens if there are 10,000 notes? Does React crash?

## Expected Answers
1. It uses `getBoundingClientRect()` to get the mouse position relative to the container. X is divided by `pixelsPerSecond` to get `time`. Y is divided by `ROW_HEIGHT` to get the vertical index, which is inverted and added to `START_MIDI` to determine the pitch.
2. React state updates are too slow for smooth scrolling. By using `onScroll` on the main container and imperatively setting `scrollTop` and `scrollLeft` on the child containers via `useRef`, the scrolling stays perfectly locked in sync visually without triggering React renders.
3. Rendering notes is O(N) where N is the number of notes in the `rawNotes` array.
4. *Follow-up 1:* The `pixelsPerSecond` variable increases. The `totalWidth` expands. Because the `Playhead` component calculates its `left` CSS property dynamically based on `pixelsPerSecond`, it instantly jumps to its new correct visual position without interrupting audio playback.
5. *Follow-up 2:* Rendering 10,000 DOM nodes in React can cause severe lag. While this component is optimized with Sets and Shallow selectors, a production-grade app would require "Windowing" (Virtualization) – only rendering the notes currently visible in the scroll viewport.
