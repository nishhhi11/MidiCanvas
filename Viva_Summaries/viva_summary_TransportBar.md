# FILE SUMMARY: src/components/editor/TransportBar.jsx

## Purpose
Provides the UI buttons for Play, Pause, and Stop, and wires them up to both the imperative audio engine and the declarative React state.

## Data Flow
User Clicks Play -> `handlePlay` calls `playbackEngine.start()` (Audio Layer) -> `handlePlay` calls `play()` (Zustand Layer) -> Component re-renders with new status.

## React Concepts Used
- Using custom hooks (`usePlaybackStore`) to connect to global state.

## Most Likely Viva Questions
1. Why does `handlePlay` need to call both `playbackEngine.play()` and `play()`?

## Expected Answers
1. Because our application uses a dual-architecture. `playbackEngine.play()` is an imperative command that talks directly to the Web Audio API to physically start making sound. `play()` is a declarative command that updates the Zustand store so React knows to re-render the UI and show the "Playing" text. They must be kept in sync.
