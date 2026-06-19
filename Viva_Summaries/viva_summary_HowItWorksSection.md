# FILE SUMMARY: src/components/landing/HowItWorksSection.jsx

## Purpose
Landing page stepper indicating the pipeline a MIDI file goes through.

## React Concepts Used
- Setting intervals inside `useEffect` with proper cleanup.
- Computing dynamic CSS (progress bar width based on state).

## Most Likely Viva Questions
1. Why do you need to return `clearInterval(timer)` in the useEffect?

## Expected Answers
1. `setInterval` registers a repeating task with the browser's event loop. If the user navigates away from the landing page, the component unmounts, but the interval will keep firing forever in the background, trying to update state on a non-existent component (a memory leak). Returning `clearInterval` acts as a cleanup function that React guarantees to run right before unmounting.
