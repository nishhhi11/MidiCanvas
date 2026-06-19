# FILE SUMMARY: src/components/editor/VelocityLane.jsx

## Purpose
Renders a horizontal UI lane that visualizes note velocities (how hard a note is struck) as vertical bars. Allows the user to click and drag the bars up/down to modify the velocity of specific notes.

## Data Flow
User drags bar -> `handlePointerMove` calculates Y relative to container -> Dispatches `onNoteUpdate` callback -> Zustand store updates `note.velocity` -> Re-renders bar with new height.

## React Concepts Used
- Controlled components via prop drilling (receiving `onNoteUpdate`).
- `useRef` to get container dimensions for math calculations.

## JavaScript/Browser Concepts Used
- `setPointerCapture` for robust dragging mechanics.
- `getBoundingClientRect()` to calculate coordinates relative to the DOM element, not the whole screen.

## Most Likely Viva Questions
1. How does the dragging math work to change velocity?

## Expected Answers
1. `getBoundingClientRect()` gives the Y-coordinate of the mouse relative to the top of the container. We divide that Y-coordinate by the total height of the container to get a decimal (e.g., 0.25 means the mouse is 25% down from the top). Since higher velocities should be at the top visually, we subtract that value from 1 (so 25% down becomes 0.75 velocity). We use `Math.max` and `Math.min` to ensure the value is clamped exactly between 0 and 1.
