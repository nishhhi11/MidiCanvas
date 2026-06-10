import { KEY_MAP, getNotePosition } from "./keyMap";
import WhiteKey from "./WhiteKey";
import BlackKey from "./BlackKey";
import { useMidiStore } from "../../store/midiStore";
import { inputManager } from "../../services/inputManager";

export default function PianoKeyboard({ currentNotes = [] }) {
  const { playedNotes } = useMidiStore();
  
  // Convert array of active note objects to a Set of note names for fast lookup
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
}