import { useState, useEffect, useCallback } from 'react';
import { initializeAudioEngine, getSynth } from '../utils/audioEngine';
import { useMidiStore } from '../stores/midiStore';

const NOTE_TO_KEY = {
  C: 'A', D: 'S', E: 'D', F: 'F', G: 'G', A: 'H', B: 'J',
};

const SHARP_TO_NATURAL = {
  'C#': 'C', 'D#': 'D', 'F#': 'F', 'G#': 'G', 'A#': 'A',
};

function simplifyNoteName(name) {
  const match = name.match(/^([A-G]#?)(\d+)$/);
  if (!match) return name;
  const [, pitch, octave] = match;
  return `${SHARP_TO_NATURAL[pitch] ?? pitch}${octave}`;
}

function pitchClass(name) {
  return name.replace(/\d+$/, '').replace('#', '');
}

export function useLearnMode() {
  const { midiData } = useMidiStore();
  const rawNotes = midiData?.notes || [];

  const [isActive, setIsActive] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

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

  const handleKeyPress = useCallback(async (pressedNote) => {
    if (!isActive || completed || !rawCurrentNote || !pressedNote) return false;

    const pressedPitch = pitchClass(simplifyNoteName(pressedNote.name));

    if (pressedPitch !== targetPitch) return false; 

    await initializeAudioEngine();
    const synth = getSynth();
    if (synth) {

      synth.triggerAttackRelease(simplifiedName, rawCurrentNote.duration || '8n');
    }

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
