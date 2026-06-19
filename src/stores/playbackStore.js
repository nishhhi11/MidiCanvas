import { create } from 'zustand';

/*
PURPOSE:
A global state container for all variables related to the audio transport and timeline.

WHY IT EXISTS:
The playhead position (`currentTime`) and the `activeNotes` (notes currently lighting up the piano keys) need to be accessed by many different components simultaneously: The Transport Bar (play/pause), the Piano Roll Canvas (drawing the playhead), and the Vertical Keyboard (lighting up keys). Zustand provides a highly performant way to share this rapidly changing data without passing props deeply.

REACT CONCEPT:
Global State Management.

VIVA QUESTION:
Why is `currentTime` stored in Zustand instead of a local `useState` inside the Playhead component?

VIVA ANSWER:
If it were a local `useState`, other components like the Velocity Lane or the Vertical Keyboard wouldn't know where the playhead is or what notes are currently playing. By keeping it in Zustand, any component can selectively subscribe to the timeline's exact position.
*/
export const usePlaybackStore = create((set) => ({
  // Core transport states
  playbackState: 'stopped', // 'playing', 'paused', 'stopped'
  currentTime: 0,           // Playhead position in seconds
  
  /*
  PURPOSE:
  Stores the exact note objects that are sounding at the current millisecond.
  Used by the piano keys to light up dynamically.
  */
  activeNotes: [],
  
  // Loop region settings
  isLooping: false,
  loopStart: 0,
  loopEnd: 0,
  
  // Metronome and tempo controls
  playbackRate: 1.0,
  isMetronomeOn: false,

  // Setters
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setPlaybackState: (state) => set({ playbackState: state }),
  
  /*
  PERFORMANCE NOTE:
  `setCurrentTime` is called 60 times a second by `requestAnimationFrame`. Any component that subscribes to `currentTime` will re-render at 60fps.
  */
  setCurrentTime: (time) => set({ currentTime: time }),
  setActiveNotes: (notes) => set({ activeNotes: notes }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  setIsLooping: (val) => set({ isLooping: val }),
  toggleMetronome: () => set((state) => ({ isMetronomeOn: !state.isMetronomeOn })),
  setLoopPoints: (start, end) => set({ loopStart: start, loopEnd: end }),
  
  /*
  PURPOSE:
  Resets all transport values back to defaults. Called when loading a new file or hitting Stop.
  */
  resetPlayback: () => set({ 
    playbackState: 'stopped', 
    currentTime: 0, 
    activeNotes: [], 
    playbackRate: 1.0, 
    loopStart: 0, 
    loopEnd: 0, 
    isMetronomeOn: false 
  }),
}));

/*
========================================
FILE SUMMARY
========================================

Purpose:
Manages the global state for the audio playback system, including play/pause status, the current playhead time, looping regions, and which notes are actively sounding.

Data Flow:
`usePlayback` hook calculates time/notes via `requestAnimationFrame` -> Calls `setCurrentTime` / `setActiveNotes` -> Zustand Store Updates -> Subscribed UI Components (Playhead, Keys) Re-render at 60fps.

Important Variables:
- `playbackState`: Enum string controlling UI buttons ('playing', 'paused', 'stopped').
- `currentTime`: Floating point number tracking audio position in seconds.
- `activeNotes`: Array of notes currently intersecting the playhead.

Important Functions:
- `setCurrentTime`: High-frequency setter called by the animation loop.
- `resetPlayback`: Utility to cleanly reset the entire transport state.

React Concepts Used:
- Global State Management (Zustand).

JavaScript Concepts Used:
- Arrow functions with implicit object returns `() => ({ ... })`.

Performance Considerations:
- **High Frequency Updates:** `currentTime` and `activeNotes` update 60 times a second. It is critical that components subscribing to this store use selective binding (e.g., `usePlaybackStore(state => state.currentTime)`) so that the *entire* application doesn't re-render 60 times a second, only the components that actually need the playhead data.

Most Likely Viva Questions:
1. Why put playback state in a global store?
2. How do components access this state without re-rendering unnecessarily?

Tricky Follow-Up Questions:
1. Since `currentTime` updates 60 times a second, won't it cause a massive performance hit?

Expected Answers:
1. Playback state is inherently global. The TransportBar needs to toggle play/pause, the PianoRoll needs to draw the playhead, and the Keyboard needs to know which notes to highlight. Prop drilling this data would be an anti-pattern.
2. Zustand allows components to pass a selector function. For example, if the TransportBar only selects `playbackState`, it will *not* re-render when `currentTime` changes, even though they live in the same store.
3. *Follow-up 1:* It would cause a performance hit if poorly managed. But because of Zustand's selective rendering, only the tiny `<Playhead />` component and the `<VerticalKeyboard />` component re-render 60 times a second. The massive grid and note arrays do not re-render.
*/
