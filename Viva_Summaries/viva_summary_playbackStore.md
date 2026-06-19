# FILE SUMMARY: src/stores/playbackStore.js

## Purpose
Manages the global state for the audio playback system, including play/pause status, the current playhead time, looping regions, and which notes are actively sounding.

## Data Flow
`usePlayback` hook calculates time/notes via `requestAnimationFrame` -> Calls `setCurrentTime` / `setActiveNotes` -> Zustand Store Updates -> Subscribed UI Components (Playhead, Keys) Re-render at 60fps.

## Important Variables
- `playbackState`: Enum string controlling UI buttons ('playing', 'paused', 'stopped').
- `currentTime`: Floating point number tracking audio position in seconds.
- `activeNotes`: Array of notes currently intersecting the playhead.

## Important Functions
- `setCurrentTime`: High-frequency setter called by the animation loop.
- `resetPlayback`: Utility to cleanly reset the entire transport state.

## React Concepts Used
- Global State Management (Zustand).

## JavaScript Concepts Used
- Arrow functions with implicit object returns `() => ({ ... })`.

## Performance Considerations
- **High Frequency Updates:** `currentTime` and `activeNotes` update 60 times a second. It is critical that components subscribing to this store use selective binding (e.g., `usePlaybackStore(state => state.currentTime)`) so that the *entire* application doesn't re-render 60 times a second, only the components that actually need the playhead data.

## Most Likely Viva Questions
1. Why put playback state in a global store?
2. How do components access this state without re-rendering unnecessarily?

## Tricky Follow-Up Questions
1. Since `currentTime` updates 60 times a second, won't it cause a massive performance hit?

## Expected Answers
1. Playback state is inherently global. The TransportBar needs to toggle play/pause, the PianoRoll needs to draw the playhead, and the Keyboard needs to know which notes to highlight. Prop drilling this data would be an anti-pattern.
2. Zustand allows components to pass a selector function. For example, if the TransportBar only selects `playbackState`, it will *not* re-render when `currentTime` changes, even though they live in the same store.
3. *Follow-up 1:* It would cause a performance hit if poorly managed. But because of Zustand's selective rendering, only the tiny `<Playhead />` component and the `<VerticalKeyboard />` component re-render 60 times a second. The massive grid and note arrays do not re-render.
