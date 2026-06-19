# FILE SUMMARY: src/components/editor/BlackKey.jsx

## Purpose
A simple UI component for a black piano key.

## React Concepts Used
- Props for styling (`left`, `width`, `isActive`) and event handling (`onMouseDown`, `onMouseUp`).
- Conditional classNames for active/pressed styling.

## Most Likely Viva Questions
1. Why is `z-10` important here?

## Expected Answers
1. Black keys physically sit "on top" of white keys. In CSS, the z-index controls the stacking order along the Z-axis. Giving the black key `z-10` ensures it renders above the white keys, which have default z-indexes.
