# FILE SUMMARY: src/hooks/usePlayback.js

## Purpose
A controller hook that synchronizes the React application state (Zustand) with the imperative Web Audio API / Tone.js engine. It handles playback controls, animation loops, and note-activation logic.

## Data Flow
User clicks Play -> `handlePlay` calls `initializeAudio()` and `playMidi()` -> Sets `playbackState` to 'playing' -> `useEffect` triggers `requestAnimationFrame(updateTimeline)` -> Timeline updates `currentTime` and `activeNotes` 60 times a second -> UI re-renders.

## Important Variables
- `requestRef`: A `useRef` holding the animation frame ID to allow cancellation.
- `activeNotes`: An array of notes that are currently sounding at the exact `currentTime`.

## Important Functions
- `updateTimeline`: The 60fps render loop.
- `handlePlay`, `handlePause`, `handleStop`, `handleSeek`: Exposes imperative controls to UI buttons.

## React Concepts Used
- `useEffect` for synchronizing external systems (Tone.js engine).
- `useRef` for keeping mutable values (frame ID) that don't trigger re-renders.
- `useCallback` for memoizing event handlers.

## JavaScript Concepts Used
- `requestAnimationFrame` (Browser API)
- Array filtering (`filter`, `map`)

## Browser APIs Used
- Web Audio API (implicitly via `initializeAudio`)
- `requestAnimationFrame` / `cancelAnimationFrame`

## Performance Considerations
- **`requestAnimationFrame` vs `setInterval`:** rAF is synced with monitor refresh rate (typically 60Hz), pauses when the tab is inactive (saving battery/CPU), and provides smoother visual updates.
- **Filtering Active Notes:** The `filter` inside `updateTimeline` runs 60 times a second. If the MIDI file has 50,000 notes, filtering the entire array 60 times a second is highly CPU intensive. A future optimization would be an Interval Tree or keeping a sorted array and using binary search.

## Most Likely Viva Questions
1. Explain the role of `useEffect` in this file.
2. Why is `requestRef` used instead of a standard `let` variable or `useState`?
3. How are you determining which notes light up on the piano keyboard?

## Tricky Follow-Up Questions
1. What happens to `requestAnimationFrame` if the user switches to a different browser tab? 
2. How would you optimize the `notes.filter` block for a song with 100,000 notes?

## Expected Answers
1. React components are declarative. Tone.js is imperative. `useEffect` is used to sync the declarative React state (e.g., volume slider changes) with the imperative engine (e.g., `setMasterVolume`).
2. A `let` variable would reset on every re-render. `useState` would trigger *another* re-render every time we saved the frame ID, causing an infinite loop. `useRef` persists the ID across renders without triggering a re-render.
3. Every frame, we filter the entire notes array. If the `currentTime` falls between a note's `time` and `time + duration`, and the track isn't muted, it is pushed to the `activeNotes` Zustand store, which the Piano Keyboard component listens to.
4. *Follow-up 1:* The browser drastically throttles or pauses it to save resources, which is why we must rely on Tone.js's internal clock rather than counting frames.
5. *Follow-up 2:* I would sort the notes by start time, and maintain an index of the "current" notes. As the playhead moves forward, I only check the next few notes in the array rather than scanning all 100,000 every single frame.
