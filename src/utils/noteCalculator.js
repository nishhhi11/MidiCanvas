

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
