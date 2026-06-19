# FILE SUMMARY: src/stores/midiStore.js

## Purpose
Manages the central global state for the MIDI data and implements the Undo/Redo history system using Zustand.

## Data Flow
Components call action functions (e.g., `updateNote`) -> Store updates its internal state immutably and manages history stacks -> Subscribed components re-render with new data.

## Important Variables
- `midiData`: The core structured JSON representing the song.
- `history`: An object containing `past` and `future` arrays for undo/redo functionality.
- `MAX_HISTORY`: A constant limiting the depth of the undo stack to prevent memory exhaustion.

## Important Functions
- `updateNote`, `deleteNote`, `addNote`: Actions that modify the note array and push the previous state to the `past` history stack.
- `undo`, `redo`: Actions that shift states between the `past`, current, and `future` stacks.

## React Concepts Used
- Global State Management
- Immutable Data Structures (using spread operators `...` to create new object/array references)

## JavaScript Concepts Used
- Arrow functions with implicit returns
- Array methods (`map`, `filter`, `slice`)
- Spread syntax for arrays and objects

## Design Patterns
- Command / Memento Pattern (Conceptual): Storing previous states of an object to allow rolling back (Undo/Redo).
- Flux-like architecture: State is read-only from the outside, and can only be updated via predefined action functions.

## Performance Considerations
- **Zustand Selectors:** Components only re-render when the specific slice of state they select changes.
- **Max History Limit:** Capping history at 50 prevents the browser tab from crashing due to running out of RAM (Out of Memory exception) when dealing with large arrays.
- **Array Cloning:** Storing full arrays of objects in history is memory intensive. A more advanced approach would be storing only the *diffs* (patches) of what changed, but full array storage is simpler to implement for medium-sized data.

## Most Likely Viva Questions
1. Why did you use Zustand instead of React's built-in Context API?
2. How does your Undo/Redo system work?
3. Why do you use `.slice(-MAX_HISTORY)` when adding to the past stack?

## Tricky Follow-Up Questions
1. If I change a note, why must we clear the `future` array?
2. Is storing entire arrays of notes in the history stack efficient?

## Expected Answers
1. Context API triggers re-renders for all consumers whenever any value changes, which causes severe performance drops in an editor. Zustand allows components to selectively subscribe to only the data they care about.
2. We maintain a `past` array and a `future` array. When a user modifies a note, we save the current array of notes to `past`. `undo` pops from `past`, sets it as current, and pushes current to `future`. `redo` does the reverse.
3. It acts as a sliding window. If the stack exceeds 50 items, `.slice` drops the oldest items from the beginning of the array, preventing memory leaks and application crashes.
4. *Follow-up 1:* Because branching history creates an alternate timeline; you can't "redo" an action from a timeline you just diverged from.
5. *Follow-up 2:* It trades memory efficiency for implementation simplicity. For massive datasets, an 'Action/Patch' based history is better.
