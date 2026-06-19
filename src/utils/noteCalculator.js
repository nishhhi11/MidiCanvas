/*
PURPOSE:
Mathematical conversion functions between MIDI numbers, physical frequencies (Hz), and string note names (e.g., "C4").

VIVA QUESTION:
Can you explain the math behind `midiToFrequency`?

VIVA ANSWER:
Yes. The standard tuning pitch is A4, which is exactly 440 Hz and corresponds to MIDI note 69. Because the western musical scale divides an octave into 12 equal semitones (equal temperament), every semitone is a ratio of the 12th root of 2. So, `440 * (2 ^ ((midi - 69) / 12))` calculates the exact Hertz frequency for any given MIDI note.
*/

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function frequencyToMidi(freq) {
  return Math.round(12 * Math.log2(freq / 440) + 69);
}

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[midi % 12];
  return `${note}${octave}`;
}

export function isBlackKey(midi) {
  return [1, 3, 6, 8, 10].includes(midi % 12);
}

export function noteToY(midi, startMidi = 21, rowHeight = 16, totalKeys = 88) {
  return (totalKeys - 1 - (midi - startMidi)) * rowHeight;
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Music theory mathematical converters.
*/
