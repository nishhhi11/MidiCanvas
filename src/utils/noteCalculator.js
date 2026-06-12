/**
 * noteCalculator.js
 * MIDI note number ↔ frequency / name conversions
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Convert a MIDI note number (0-127) to its frequency in Hz.
 * Uses A4 = 440 Hz as the reference pitch.
 * @param {number} midi - MIDI note number
 * @returns {number} frequency in Hz
 */
export function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Convert a frequency in Hz to the nearest MIDI note number.
 * @param {number} freq - frequency in Hz
 * @returns {number} MIDI note number (rounded)
 */
export function frequencyToMidi(freq) {
  return Math.round(12 * Math.log2(freq / 440) + 69);
}

/**
 * Get the human-readable name of a MIDI note (e.g. "C4", "F#5").
 * @param {number} midi - MIDI note number
 * @returns {string} note name with octave
 */
export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[midi % 12];
  return `${note}${octave}`;
}

/**
 * Determine whether a MIDI note number is a black key.
 * @param {number} midi - MIDI note number
 * @returns {boolean}
 */
export function isBlackKey(midi) {
  return [1, 3, 6, 8, 10].includes(midi % 12);
}

/**
 * Calculate the Y position of a note in the piano roll.
 * @param {number} midi - MIDI note number
 * @param {number} startMidi - lowest visible MIDI note (default 21 = A0)
 * @param {number} rowHeight - pixel height per row
 * @param {number} totalKeys - total number of visible keys
 * @returns {number} top position in pixels
 */
export function noteToY(midi, startMidi = 21, rowHeight = 16, totalKeys = 88) {
  return (totalKeys - 1 - (midi - startMidi)) * rowHeight;
}
