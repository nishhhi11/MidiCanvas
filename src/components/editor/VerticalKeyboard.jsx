import { KEY_MAP, getNotePosition } from "../editor/keyMap";
import WhiteKey from "../editor/WhiteKey";
import BlackKey from "../editor/BlackKey";
import { useMidiStore } from "../../stores/midiStore";
import { inputManager } from "../../utils/inputManager";

export default function PianoKeyboard({ currentNotes = [] }) {
  const { playedNotes } = useMidiStore();

  const activeNoteSet = new Set(currentNotes.map(n => n.name));

  const handleMouseDown = (note) => {
    inputManager.handleNoteOn(note);
  };

  const handleMouseUp = (note) => {
    inputManager.handleNoteOff(note);
  };

  return (
    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
      {KEY_MAP.map((keyData, index) => {
        const isActive = activeNoteSet.has(keyData.note);
        const position = getNotePosition(keyData.note);

        if (!position) return null;

        if (keyData.type === "white") {
          return (
            <WhiteKey
              key={index}
              note={keyData.note}
              left={position.left}
              width={position.width}
              isActive={isActive}
              onMouseDown={() => handleMouseDown(keyData.note)}
              onMouseUp={() => handleMouseUp(keyData.note)}
            />
          );
        } else {
          return (
            <BlackKey
              key={index}
              note={keyData.note}
              left={position.left}
              width={position.width}
              isActive={isActive}
              onMouseDown={() => handleMouseDown(keyData.note)}
              onMouseUp={() => handleMouseUp(keyData.note)}
            />
          );
        }
      })}
    </div>
  );
}export default function WhiteKey({ note, left, width, isActive, onMouseDown, onMouseUp }) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className={`absolute bottom-0 h-full border-r border-zinc-400 flex items-end justify-center pb-2 font-semibold transition-all select-none cursor-pointer rounded-b-md ${
        isActive 
          ? "bg-orange-500 text-black translate-y-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]" 
          : "bg-white text-black"
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="pointer-events-none text-[10px]">{note}</span>
    </div>
  );
}
export default function BlackKey({ note, left, width, isActive, onMouseDown, onMouseUp }) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className={`absolute top-0 h-[65%] border-x border-b border-black flex items-end justify-center pb-2 font-semibold transition-all select-none cursor-pointer rounded-b-sm z-10 ${
        isActive 
          ? "bg-orange-600 text-white translate-y-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]" 
          : "bg-zinc-900 text-zinc-400"
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="pointer-events-none text-[10px]">{note}</span>
    </div>
  );
}
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

    const leftWhiteKey = noteName.replace("#", "");
    const leftIndex = whiteKeyNotes.indexOf(leftWhiteKey);
    const leftWhiteRightEdge = (leftIndex + 1) * whiteKeyWidth;

    const blackKeyWidth = whiteKeyWidth * 0.6; 
    const blackKeyLeft = leftWhiteRightEdge - (blackKeyWidth / 2);

    return {
      left: blackKeyLeft,
      width: blackKeyWidth,
      type: "black"
    };
  }
}
