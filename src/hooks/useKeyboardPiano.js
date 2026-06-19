import { useState, useEffect, useCallback } from 'react';

/*
PURPOSE:
Maps physical computer keyboard keys (A, S, D, F...) to musical MIDI note numbers.

REACT CONCEPT:
Constant data mapping outside the component to prevent recreation on every render.
*/
const KEY_NOTE_MAP = {
  'a': { name: 'C4',  midi: 60 },
  's': { name: 'D4',  midi: 62 },
  'd': { name: 'E4',  midi: 64 },
  'f': { name: 'F4',  midi: 65 },
  'g': { name: 'G4',  midi: 67 },
  'h': { name: 'A4',  midi: 69 },
  'j': { name: 'B4',  midi: 71 },
  'k': { name: 'C5',  midi: 72 },
};

/*
PURPOSE:
A custom React hook that allows the user to play the piano using their computer keyboard.

REACT CONCEPT:
Custom Hook. Encapsulates event listeners and state management so it can be reused across different components (like the Editor and the Learn Mode).
*/
export function useKeyboardPiano() {

  // Tracks which keys are currently held down
  const [activeKeys, setActiveKeys] = useState(new Set());

  // Tracks the most recently pressed note for immediate audio triggering
  const [pressedNote, setPressedNote] = useState(null);

  /*
  PURPOSE:
  Handles the 'keydown' event.

  VIVA QUESTION:
  Why do you check `e.repeat` in `handleKeyDown`?

  VIVA ANSWER:
  When you hold down a key on a computer keyboard, the OS repeatedly fires 'keydown' events really fast. If we didn't check `e.repeat`, the audio engine would try to re-trigger the same note 30 times a second, causing terrible audio distortion and lag. We only want to process the *initial* press.
  */
  const handleKeyDown = useCallback((e) => {
    // Ignore auto-repeat, and ignore if typing in a text box
    if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    const note = KEY_NOTE_MAP[key];

    if (note && !activeKeys.has(note.midi)) {
      setActiveKeys(prev => new Set(prev).add(note.midi));
      setPressedNote(note);
    }
  }, [activeKeys]);

  /*
  PURPOSE:
  Handles the 'keyup' event to stop playing the note.
  */
  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    const note = KEY_NOTE_MAP[key];

    if (note) {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note.midi);
        return next;
      });

      setPressedNote(prev => (prev?.midi === note.midi ? null : prev));
    }
  }, []);

  /*
  PURPOSE:
  Attaches the event listeners to the global window object.

  REACT CONCEPT:
  `useEffect` for DOM side effects.
  Cleanup function `return () => ...` prevents memory leaks when the component using this hook unmounts.
  */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Transform the Set into an array for easier rendering in components
  const activeNotes = Array.from(activeKeys).map(midi => ({ midi }));

  return { pressedNote, activeNotes, activeKeys };
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A custom React hook that translates computer keyboard presses into musical MIDI notes.

Data Flow:
User presses 'A' -> `handleKeyDown` -> State updates `activeKeys` & `pressedNote` -> Hook returns new state -> Component using the hook triggers audio.

Important Variables:
- `activeKeys`: A Set of currently pressed MIDI numbers.
- `pressedNote`: The single most recently pressed note object.

React Concepts Used:
- `useEffect`: Event listener management and cleanup.
- `useCallback`: Memoizes the event handlers to prevent unnecessary re-renders or re-attachments in the `useEffect`.
- `useState`: Stores the pressed keys.

Browser APIs Used:
- `window.addEventListener('keydown', ...)`

Most Likely Viva Questions:
1. What does `e.repeat` do?
2. Why is `window.removeEventListener` important?

Expected Answers:
1. Operating systems send continuous `keydown` events when a key is held. `e.repeat` is a boolean flag indicating if the event is from this OS-level holding behavior. We ignore it so we don't trigger the synthesizer repeatedly.
2. If we navigate away from the page that uses this hook without removing the event listener, the browser keeps listening. If we come back, it attaches *another* listener. Pressing a key would then trigger the function twice, causing bugs and memory leaks.
*/
