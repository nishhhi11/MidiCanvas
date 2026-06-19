/*
PURPOSE:
A utility file containing the static mapping of musical notes to computer keyboard keys, as well as a function to calculate the visual CSS width/left percentage of any key on the Piano Roll.

JAVASCRIPT CONCEPT:
Constants and pure utility functions.
*/

// Used to calculate visual percentages. There are 14 white keys in a 2-octave piano UI.
export const whiteKeyNotes = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5"
];

// Mapping structure linking scientific pitch notation to QWERTY keyboard characters.
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

/*
PURPOSE:
Calculates the exact CSS `left` and `width` percentages to draw a piano key correctly relative to its container.

VIVA QUESTION:
Why do we calculate the position of a black key based on the white key next to it?

VIVA ANSWER:
Because musically, a black key sits exactly between two white keys. By first calculating the percentage width of a white key (`100% / 14 = ~7.14%`), we can find the right edge of the preceding white key. We then set the black key's left position to that edge minus half of the black key's width, perfectly centering it over the crack between the two white keys.
*/
export function getNotePosition(noteName) {
  const mapData = KEY_MAP.find(k => k.note === noteName);
  if (!mapData) return null;

  // 14 white keys total. Width of one white key in percentage.
  const whiteKeyWidth = 100 / whiteKeyNotes.length;

  if (mapData.type === "white") {
    const index = whiteKeyNotes.indexOf(noteName);
    return {
      left: index * whiteKeyWidth,
      width: whiteKeyWidth,
      type: "white"
    };
  } else {
    // If it's a black key, find the white key immediately to its left.
    // E.g., for C#4, the left key is C4.
    const leftWhiteKey = noteName.replace("#", "");
    const leftIndex = whiteKeyNotes.indexOf(leftWhiteKey);
    
    // Find the pixel coordinate of the crack between the left white key and the right white key
    const leftWhiteRightEdge = (leftIndex + 1) * whiteKeyWidth;

    // Black keys are slightly skinnier than white keys
    const blackKeyWidth = whiteKeyWidth * 0.6; 
    
    // Center the black key exactly over the crack
    const blackKeyLeft = leftWhiteRightEdge - (blackKeyWidth / 2);

    return {
      left: blackKeyLeft,
      width: blackKeyWidth,
      type: "black"
    };
  }
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Provides the mathematical layout logic for drawing an interactive virtual piano UI.

JavaScript Concepts Used:
- Array `.find()` and `.indexOf()`.
- Static JSON-like object arrays.
*/
