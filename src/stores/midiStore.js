import { create } from 'zustand';

/*
PURPOSE:
Defines the maximum number of undo/redo states the application will keep in memory.

WHY IT EXISTS:
Storing every single change to a potentially massive array of notes (e.g., 10,000 notes) consumes a lot of RAM. Capping it at 50 prevents memory exhaustion and browser crashes while still providing a good user experience.
*/
const MAX_HISTORY = 50;

/*
PURPOSE:
Creates a global state container using Zustand for managing the core MIDI data and editor history.

WHY IT EXISTS:
In React, passing data down multiple levels of components (prop drilling) is messy and causes unnecessary re-renders. Zustand provides a centralized, global store that any component can access directly, updating only the components that listen to specific state changes.

REACT CONCEPT:
Global State Management (alternative to React Context API or Redux).

VIVA QUESTION:
Why did you choose Zustand over Redux or React Context?

VIVA ANSWER:
React Context causes all consuming components to re-render whenever *any* value in the provider changes, which is terrible for performance in a complex app like a piano roll. Redux is boilerplate-heavy. Zustand is lightweight, avoids unnecessary re-renders by allowing components to select only the state slices they need, and has a simpler API.
*/
export const useMidiStore = create((set) => ({
  // Core state variables
  midiData: null,
  uploadedFile: null,
  isParsing: false,
  
  /*
  PURPOSE:
  Stores the undo and redo stacks for the editor.
  `past` holds previous states of the notes array.
  `future` holds undone states that can be redone.
  */
  history: { past: [], future: [] },

  // Basic setters
  setIsParsing: (isParsing) => set({ isParsing }),
  
  /*
  PURPOSE:
  Sets the newly parsed MIDI data and wipes the history.
  WHY IT EXISTS: When loading a new file, we shouldn't be able to "undo" into the previous file's state.
  */
  setMidiData: (data) => set({ midiData: data, history: { past: [], future: [] } }),
  setUploadedFile: (fileName) => set({ uploadedFile: fileName }),
  clearMidiData: () => set({ midiData: null, uploadedFile: null, isParsing: false, history: { past: [], future: [] } }),
  
  updateMidiMetadata: (updates) => set((state) => {
    if (!state.midiData) return state;
    return { midiData: { ...state.midiData, ...updates } };
  }),

  /*
  PURPOSE:
  Updates the properties of a specific note (e.g., when a user drags a note to change its pitch or time).
  
  INPUT:
  `id`: The unique string ID of the note.
  `updates`: An object containing the new values (e.g., `{ time: 2.5 }`).
  
  OUTPUT:
  Updates the global state.
  */
  updateNote: (id, updates) => set((state) => {
    if (!state.midiData || !state.midiData.notes) return state;

    // 1. Save current state to history before modifying
    const past = [...state.history.past, state.midiData.notes].slice(-MAX_HISTORY);

    // 2. Map over notes, updating only the one with the matching ID
    const newNotes = state.midiData.notes.map(n => n.id === id ? { ...n, ...updates } : n);
    
    // 3. Update state, clearing the future array (because branching history invalidates future redos)
    return { 
      midiData: { ...state.midiData, notes: newNotes },
      history: { past, future: [] }
    };
  }),

  /*
  PURPOSE:
  Removes a note from the canvas.
  */
  deleteNote: (id) => set((state) => {
    if (!state.midiData || !state.midiData.notes) return state;

    const past = [...state.history.past, state.midiData.notes].slice(-MAX_HISTORY);

    // Filter out the note with the matching ID
    const newNotes = state.midiData.notes.filter(n => n.id !== id);
    return { 
      midiData: { ...state.midiData, notes: newNotes },
      history: { past, future: [] }
    };
  }),

  /*
  PURPOSE:
  Adds a newly drawn note to the canvas.
  */
  addNote: (newNote) => set((state) => {
    // Edge case: If drawing a note on a completely empty project
    if (!state.midiData) {
      return { midiData: { notes: [newNote], duration: newNote.time + newNote.duration }, history: { past: [], future: [] } };
    }
    
    const notes = state.midiData.notes || [];
    const past = [...state.history.past, notes].slice(-MAX_HISTORY);
    const newNotes = [...notes, newNote];
    
    return { 
      midiData: { ...state.midiData, notes: newNotes },
      history: { past, future: [] }
    };
  }),

  /*
  PURPOSE:
  Reverts the `notes` array to the previous state in the `past` stack.
  
  REACT CONCEPT:
  Immutable state updates. We create new arrays rather than modifying existing ones.
  */
  undo: () => set((state) => {
    if (state.history.past.length === 0 || !state.midiData) return state;

    // Pop the last state from 'past'
    const previousNotes = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    
    // Push the current state to 'future'
    const newFuture = [state.midiData.notes, ...state.history.future];

    return {
      midiData: { ...state.midiData, notes: previousNotes },
      history: { past: newPast, future: newFuture }
    };
  }),

  /*
  PURPOSE:
  Re-applies a previously undone state from the `future` stack.
  */
  redo: () => set((state) => {
    if (state.history.future.length === 0 || !state.midiData) return state;

    // Pop the first state from 'future'
    const nextNotes = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    
    // Push the current state back to 'past'
    const newPast = [...state.history.past, state.midiData.notes];

    return {
      midiData: { ...state.midiData, notes: nextNotes },
      history: { past: newPast, future: newFuture }
    };
  }),
}));

/*
========================================
FILE SUMMARY
========================================

Purpose:
Manages the central global state for the MIDI data and implements the Undo/Redo history system using Zustand.

Data Flow:
Components call action functions (e.g., `updateNote`) -> Store updates its internal state immutably and manages history stacks -> Subscribed components re-render with new data.

Important Variables:
- `midiData`: The core structured JSON representing the song.
- `history`: An object containing `past` and `future` arrays for undo/redo functionality.
- `MAX_HISTORY`: A constant limiting the depth of the undo stack to prevent memory exhaustion.

Important Functions:
- `updateNote`, `deleteNote`, `addNote`: Actions that modify the note array and push the previous state to the `past` history stack.
- `undo`, `redo`: Actions that shift states between the `past`, current, and `future` stacks.

React Concepts Used:
- Global State Management
- Immutable Data Structures (using spread operators `...` to create new object/array references)

JavaScript Concepts Used:
- Arrow functions with implicit returns
- Array methods (`map`, `filter`, `slice`)
- Spread syntax for arrays and objects

Design Patterns:
- Command / Memento Pattern (Conceptual): Storing previous states of an object to allow rolling back (Undo/Redo).
- Flux-like architecture: State is read-only from the outside, and can only be updated via predefined action functions.

Performance Considerations:
- **Zustand Selectors:** Components only re-render when the specific slice of state they select changes.
- **Max History Limit:** Capping history at 50 prevents the browser tab from crashing due to running out of RAM (Out of Memory exception) when dealing with large arrays.
- **Array Cloning:** Storing full arrays of objects in history is memory intensive. A more advanced approach would be storing only the *diffs* (patches) of what changed, but full array storage is simpler to implement for medium-sized data.

Most Likely Viva Questions:
1. Why did you use Zustand instead of React's built-in Context API?
2. How does your Undo/Redo system work?
3. Why do you use `.slice(-MAX_HISTORY)` when adding to the past stack?

Tricky Follow-Up Questions:
1. If I change a note, why must we clear the `future` array? (Answer: Because branching history creates an alternate timeline; you can't "redo" an action from a timeline you just diverged from).
2. Is storing entire arrays of notes in the history stack efficient? (Answer: It trades memory efficiency for implementation simplicity. For massive datasets, an 'Action/Patch' based history is better).

Expected Answers:
1. Context API triggers re-renders for all consumers whenever any value changes, which causes severe performance drops in an editor. Zustand allows components to selectively subscribe to only the data they care about.
2. We maintain a `past` array and a `future` array. When a user modifies a note, we save the current array of notes to `past`. `undo` pops from `past`, sets it as current, and pushes current to `future`. `redo` does the reverse.
3. It acts as a sliding window. If the stack exceeds 50 items, `.slice` drops the oldest items from the beginning of the array, preventing memory leaks and application crashes.
*/
