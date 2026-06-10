export const whiteKeyNotes = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5"
];

export const KEY_MAP = [
  { note: "C4", type: "white", octave: 4, pcKey: "A" },
  { note: "C#4", type: "black", octave: 4, pcKey: "W" },
  { note: "D4", type: "white", octave: 4, pcKey: "S" },
  { note: "D#4", type: "black", octave: 4, pcKey: "E" },
  { note: "E4", type: "white", octave: 4, pcKey: "D" },
  { note: "F4", type: "white", octave: 4, pcKey: "F" },
  { note: "F#4", type: "black", octave: 4, pcKey: "T" },
  { note: "G4", type: "white", octave: 4, pcKey: "G" },
  { note: "G#4", type: "black", octave: 4, pcKey: "Y" },
  { note: "A4", type: "white", octave: 4, pcKey: "H" },
  { note: "A#4", type: "black", octave: 4, pcKey: "U" },
  { note: "B4", type: "white", octave: 4, pcKey: "J" },
  
  { note: "C5", type: "white", octave: 5, pcKey: "K" },
  { note: "C#5", type: "black", octave: 5, pcKey: "O" },
  { note: "D5", type: "white", octave: 5, pcKey: "L" },
  { note: "D#5", type: "black", octave: 5, pcKey: "P" },
  { note: "E5", type: "white", octave: 5, pcKey: ";" },
  { note: "F5", type: "white", octave: 5, pcKey: "'" },
  { note: "F#5", type: "black", octave: 5, pcKey: null },
  { note: "G5", type: "white", octave: 5, pcKey: null },
  { note: "G#5", type: "black", octave: 5, pcKey: null },
  { note: "A5", type: "white", octave: 5, pcKey: null },
  { note: "A#5", type: "black", octave: 5, pcKey: null },
  { note: "B5", type: "white", octave: 5, pcKey: null },
];

export function getNotePosition(noteName) {
  const mapData = KEY_MAP.find(k => k.note === noteName);
  if (!mapData) return null;

  const whiteKeyWidth = 100 / whiteKeyNotes.length;

  if (mapData.type === "white") {
    const index = whiteKeyNotes.indexOf(noteName);
    return {
      left: index * whiteKeyWidth,
      width: whiteKeyWidth,
      type: "white"
    };
  } else {
    // Black key logic
    // The note name (e.g. C#4) corresponds to the left white key (C4)
    const leftWhiteKey = noteName.replace("#", "");
    const leftIndex = whiteKeyNotes.indexOf(leftWhiteKey);
    const leftWhiteRightEdge = (leftIndex + 1) * whiteKeyWidth;
    
    const blackKeyWidth = whiteKeyWidth * 0.6; // Black keys are 60% the width of white keys
    const blackKeyLeft = leftWhiteRightEdge - (blackKeyWidth / 2);

    return {
      left: blackKeyLeft,
      width: blackKeyWidth,
      type: "black"
    };
  }
}
