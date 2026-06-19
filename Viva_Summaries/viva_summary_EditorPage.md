# FILE SUMMARY: src/pages/EditorPage.jsx

## Purpose
This is the root container for the entire Editor view. It ties together the Zustand stores, the Piano Roll UI, the MIDI Parser, the Audio Engine, and the UI tools (Mixer, Transport, Interactive Keyboard).

## Data Flow
User drops file -> `handleFileUpload` -> `parseMidi` Web Worker -> `setMidiData` -> React re-renders components -> Piano Roll draws notes.

## Important Variables
- `filteredNotes`: Filters out notes belonging to muted tracks before passing them down to the canvas.
- `recordedNotes`: A `useRef` array collecting notes created by the user while the Record button is active.

## Important Functions
- `toggleRecord`: Manages a mini-engine that captures physical key presses, calculates their timing via `performance.now()`, and pushes them into the global store as a brand new MIDI file.
- `handleFileUpload`: Acts as the gateway between the filesystem and the application state.

## React Concepts Used
- Container Pattern (assembling smaller components).
- Multiple `useEffect` hooks for global event listeners (Spacebar for Play/Pause, Ctrl+Z for Undo).

## Browser APIs Used
- `e.dataTransfer.files` for Drag-and-Drop functionality.
- `performance.now()` for sub-millisecond precision during live recording.

## Most Likely Viva Questions
1. Explain how the live recording feature works.
2. How do you handle file drag-and-drop?

## Expected Answers
1. When recording starts, we save the current `performance.now()` timestamp. Whenever a user presses a key, we log the key and another timestamp. On key release, we calculate the duration by subtracting the release time from the press time. We create a JSON note object and push it to a `useRef` array. When recording stops, we bundle the array into a new MIDI file object and save it to the Zustand store.
2. We attach `onDragOver` and `onDrop` event handlers to the outermost `div`. `e.preventDefault()` prevents the browser from trying to open the file in a new tab. We grab the file from `e.dataTransfer.files[0]` and pass it to our existing `handleFileUpload` function.
