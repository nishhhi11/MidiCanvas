import { useState, useEffect, useCallback } from 'react';

// QWERTY -> MIDI note mapping (white keys only for Learn Mode)
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

export function useKeyboardPiano() {
  // Set of active MIDI numbers for O(1) lookup in keyboard component
  const [activeKeys, setActiveKeys] = useState(new Set());
  // The most recently pressed note object, or null
  const [pressedNote, setPressedNote] = useState(null);

  const handleKeyDown = useCallback((e) => {
    // Ignore: OS key repeat, modifier keys, or keys captured in input fields
    if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    const note = KEY_NOTE_MAP[key];

    if (note && !activeKeys.has(note.midi)) {
      setActiveKeys(prev => new Set(prev).add(note.midi));
      setPressedNote(note);
    }
  }, [activeKeys]);

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    const note = KEY_NOTE_MAP[key];

    if (note) {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note.midi);
        return next;
      });
      // Clear pressedNote only if it was this specific note
      setPressedNote(prev => (prev?.midi === note.midi ? null : prev));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Convert the Set of active MIDI numbers to the { midi } array format
  // that PianoKeyboard expects
  const activeNotes = Array.from(activeKeys).map(midi => ({ midi }));

  return { pressedNote, activeNotes, activeKeys };
}
