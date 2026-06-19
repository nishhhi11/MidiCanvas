# FILE SUMMARY: src/components/editor/Playhead.jsx

## Purpose
Renders the animated red playhead line and handles auto-scrolling the piano roll view.

## Data Flow
Audio Engine -> Zustand `currentTime` -> Component Re-renders -> Updates `style.left` & triggers `useEffect` to scroll container.

## React Concepts Used
- Zustand selective state subscriptions.
- `useEffect` for imperative DOM interactions (`scrollLeft`).
- Inline styling for high-frequency coordinate updates.

## Most Likely Viva Questions
1. Since this component updates 60 times a second, why doesn't it lag the whole application?
2. Why do you only select `currentTime` from the `usePlaybackStore` instead of the whole state object?

## Expected Answers
1. React's virtual DOM is very fast at updating a single `div`'s inline `left` style. Crucially, because the Playhead is its own isolated component, its 60fps re-renders are contained *only* within this tiny component. The massive Piano Roll Canvas behind it, with thousands of note components, does *not* re-render because it does not subscribe to `currentTime`.
2. Because `currentTime` updates 60 times a second. If I grabbed the whole state object, any time *any* property in the store changed, this component would re-render. By using a selector `state => state.currentTime`, Zustand ensures this component *only* re-renders when `currentTime` changes, maximizing performance.
