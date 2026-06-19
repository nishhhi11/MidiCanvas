# FILE SUMMARY: src/components/editor/MixerPanel.jsx

## Purpose
A UI component rendering the track list and mixer controls (volume, mute, solo, color).

## Data Flow
User clicks Mute -> Calls `toggleMute(trackId)` prop -> Updates `useMixerStore` -> Audio Engine reads new store state and stops scheduling notes for that track.

## React Concepts Used
- Conditional rendering (`tracks.length > 0 ? ... : ...`).
- List rendering (`tracks.map(...)`). Every item mapped from an array must have a unique `key` prop so React can efficiently update the DOM without re-rendering the whole list.

## JavaScript Concepts Used
- Destructuring assignment in component arguments.

## Most Likely Viva Questions
1. Why do you pass `toggleMute` as a prop instead of importing `useMixerStore` directly inside this component?

## Expected Answers
1. "Separation of Concerns" and testing. By passing the state and functions as props, `MixerPanel` becomes a "dumb" or "pure" component. It doesn't know where the data comes from. This makes it highly reusable (we could reuse this UI in another part of the app) and easier to test without needing to mock the Zustand store. The parent component handles the logic and passes it down.
