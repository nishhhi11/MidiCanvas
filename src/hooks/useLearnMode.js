import { useState, useEffect, useCallback } from 'react';
import { initializeAudioEngine, getSynth } from '../utils/audioEngine';
import { useMidiStore } from '../stores/midiStore';

const NOTE_TO_KEY = {
  C: 'A', D: 'S', E: 'D', F: 'F', G: 'G', A: 'H', B: 'J',
};

const SHARP_TO_NATURAL = {
  'C#': 'C', 'D#': 'D', 'F#': 'F', 'G#': 'G', 'A#': 'A',
};

/*
PURPOSE:
Converts complex notes (like C#4 or Cb4) into a format expected by the learn mode logic.
*/
function simplifyNoteName(name) {
  const match = name.match(/^([A-G]#?)(\d+)$/);
  if (!match) return name;
  const [, pitch, octave] = match;
  return `${SHARP_TO_NATURAL[pitch] ?? pitch}${octave}`;
}

function pitchClass(name) {
  return name.replace(/\d+$/, '').replace('#', '');
}

/*
PURPOSE:
Manages the "Synthesia-style" learn mode where playback pauses until the user plays the correct note.

REACT CONCEPT:
Complex custom hook managing an internal state machine (active, waiting, completed).
*/
export function useLearnMode() {
  const { midiData } = useMidiStore();
  const rawNotes = midiData?.notes || [];

  const [isActive, setIsActive] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  /*
  VIVA QUESTION:
  Why do you reset state when `rawNotes` changes?

  VIVA ANSWER:
  `rawNotes` changes when a user uploads a new MIDI file. If we didn't reset the `currentNoteIndex` to 0, the Learn Mode might crash by trying to access an index (e.g., note 500) that doesn't exist in a shorter newly uploaded file.
  */
  useEffect(() => {
    setCurrentNoteIndex(0);
    setCompleted(false);
    setIsActive(false);
  }, [rawNotes]);

  const rawCurrentNote = rawNotes[currentNoteIndex] ?? null;
  const simplifiedName = rawCurrentNote ? simplifyNoteName(rawCurrentNote.name) : null;
  const targetPitch = simplifiedName ? pitchClass(simplifiedName) : null;
  const expectedKey = targetPitch ? (NOTE_TO_KEY[targetPitch] ?? null) : null;
  const learnModeTime = rawCurrentNote ? rawCurrentNote.time : 0;

  /*
  PURPOSE:
  Validates if the physical key the user pressed matches the expected note from the MIDI file.
  */
  const handleKeyPress = useCallback(async (pressedNote) => {
    if (!isActive || completed || !rawCurrentNote || !pressedNote) return false;

    const pressedPitch = pitchClass(simplifyNoteName(pressedNote.name));

    // If they hit the wrong note, return false
    if (pressedPitch !== targetPitch) return false; 

    // Play the correct note
    await initializeAudioEngine();
    const synth = getSynth();
    if (synth) {
      synth.triggerAttackRelease(simplifiedName, rawCurrentNote.duration || '8n');
    }

    // Advance to the next note or finish
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
    currentNoteName: simplifiedName,   
    expectedKey,                        
    targetPitch,                        
    learnModeTime,
    handleKeyPress,
    startLearnMode,
    stopLearnMode,
  };
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A custom hook that intercepts normal playback, analyzes the array of MIDI notes, and requires the user to match the pitch of the current note before advancing the cursor.

React Concepts Used:
- Derived state (calculating `targetPitch` and `expectedKey` during render instead of storing them in `useState`).
- `useEffect` for data hydration tracking.
*/
