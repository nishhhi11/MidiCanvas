import { useState, useEffect, useCallback } from 'react';
import { initializeAudioEngine, getSynth } from '../utils/audioEngine';
import { useMidiStore } from '../stores/midiStore';

// Reverse lookup: pitch class -> keyboard key the user should press
const NOTE_TO_KEY = {
  C: 'A', D: 'S', E: 'D', F: 'F', G: 'G', A: 'H', B: 'J',
};

// Map sharps to the natural note below them
const SHARP_TO_NATURAL = {
  'C#': 'C', 'D#': 'D', 'F#': 'F', 'G#': 'G', 'A#': 'A',
};

/** "C#4" -> "C4", "G#5" -> "G5", "D4" -> "D4" */
function simplifyNoteName(name) {
  const match = name.match(/^([A-G]#?)(\d+)$/);
  if (!match) return name;
  const [, pitch, octave] = match;
  return `${SHARP_TO_NATURAL[pitch] ?? pitch}${octave}`;
}

/** "C4" -> "C", "D#4" -> "D" */
function pitchClass(name) {
  return name.replace(/\d+$/, '').replace('#', '');
}

export function useLearnMode() {
  const { midiData } = useMidiStore();
  const rawNotes = midiData?.notes || [];

  const [isActive, setIsActive] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Reset every time a new MIDI file is loaded
  useEffect(() => {
    setCurrentNoteIndex(0);
    setCompleted(false);
    setIsActive(false);
  }, [rawNotes]);

  // --- Derived values ---
  const rawCurrentNote = rawNotes[currentNoteIndex] ?? null;
  // The simplified note name that will appear in the piano roll ("C4", "D5", etc.)
  const simplifiedName = rawCurrentNote ? simplifyNoteName(rawCurrentNote.name) : null;
  // The bare pitch letter the user must match ("C", "D", ...)
  const targetPitch = simplifiedName ? pitchClass(simplifiedName) : null;
  // The keyboard key label to show in the HUD ("A", "S", ...)
  const expectedKey = targetPitch ? (NOTE_TO_KEY[targetPitch] ?? null) : null;
  // currentTime for PianoRoll to freeze the roll exactly at the target note
  const learnModeTime = rawCurrentNote ? rawCurrentNote.time : 0;

  /**
   * Call this with the note object from useKeyboardPiano every time pressedNote changes.
   * Returns true if the note was correct (so the caller can give feedback if desired).
   */
  const handleKeyPress = useCallback(async (pressedNote) => {
    if (!isActive || completed || !rawCurrentNote || !pressedNote) return false;

    const pressedPitch = pitchClass(simplifyNoteName(pressedNote.name));

    if (pressedPitch !== targetPitch) return false; // wrong key — do nothing

    // --- Correct key pressed ---
    // 1. Play the note via Tone.js
    await initializeAudioEngine();
    const synth = getSynth();
    if (synth) {
      // Use the simplified name so sharp notes play their natural equivalent
      synth.triggerAttackRelease(simplifiedName, rawCurrentNote.duration || '8n');
    }

    // 2. Advance
    if (currentNoteIndex + 1 >= rawNotes.length) {
      setCompleted(true);
    } else {
      setCurrentNoteIndex((prev) => prev + 1);
    }
    return true;
  }, [isActive, completed, rawCurrentNote, targetPitch, simplifiedName, currentNoteIndex, rawNotes.length]);

  const startLearnMode = useCallback(() => {
    setCurrentNoteIndex(0);
    setCompleted(false);
    setIsActive(true);
  }, []);

  const stopLearnMode = useCallback(() => {
    setIsActive(false);
    setCurrentNoteIndex(0);
    setCompleted(false);
  }, []);

  return {
    isActive,
    completed,
    currentNoteIndex,
    totalNotes: rawNotes.length,
    // UI display values
    currentNoteName: simplifiedName,   // e.g. "C4"
    expectedKey,                        // e.g. "A"
    targetPitch,                        // e.g. "C"
    // For PianoRoll: freeze scroll at target note
    learnModeTime,
    // Handlers
    handleKeyPress,
    startLearnMode,
    stopLearnMode,
  };
}
