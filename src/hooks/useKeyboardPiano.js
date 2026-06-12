import { useState, useEffect, useCallback } from 'react';

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

  const [activeKeys, setActiveKeys] = useState(new Set());

  const [pressedNote, setPressedNote] = useState(null);

  const handleKeyDown = useCallback((e) => {

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

  const activeNotes = Array.from(activeKeys).map(midi => ({ midi }));

  return { pressedNote, activeNotes, activeKeys };
}
