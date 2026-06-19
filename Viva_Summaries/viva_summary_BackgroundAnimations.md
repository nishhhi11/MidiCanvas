# FILE SUMMARY: src/components/common/BackgroundAnimations.jsx

## Purpose
A visual component that generates animated musical notes floating upwards in the background.

## React Concepts Used
- Functional Component.
- Inline styling for dynamic, randomized CSS properties.
- Using array mapping to generate multiple DOM nodes (`Array.from({length: 8}).map(...)`).

## Most Likely Viva Questions
1. What does `pointer-events-none` do here?

## Expected Answers
1. It is a CSS utility class that tells the browser to ignore all mouse events on this div. If we didn't have this, the invisible floating notes might accidentally block the user from clicking buttons on the main UI underneath them.
