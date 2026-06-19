import { KEY_MAP, getNotePosition } from "../editor/keyMap";
import WhiteKey from "../editor/WhiteKey";
import BlackKey from "../editor/BlackKey";
import { useMidiStore } from "../../stores/midiStore";
import { inputManager } from "../../utils/inputManager";

/*
PURPOSE:
Renders the vertical piano keyboard on the left side of the Piano Roll Editor.
Allows users to click keys to audition sounds.

REACT CONCEPT:
Component consuming global stores and rendering a list based on static configuration data (`KEY_MAP`).
*/
export default function PianoKeyboard({ currentNotes = [] }) {
  // Pulling state to ensure component awareness, though `activeNoteSet` currently uses passed props
  const { playedNotes } = useMidiStore();

  // Create an O(1) lookup map of all notes currently playing (sent from the Audio Engine)
  const activeNoteSet = new Set(currentNotes.map(n => n.name));

  /*
  PURPOSE:
  Handles mouse down interactions by routing them to the global `inputManager`.
  
  VIVA QUESTION:
  Why send the note event to `inputManager` instead of directly triggering Tone.js?

  VIVA ANSWER:
  The `inputManager` acts as a central hub for all musical input (Mouse Clicks, QWERTY Keyboard, MIDI Controllers). Routing the click through there ensures that the exact same logic (triggering audio, recording the note, updating the UI) happens consistently regardless of the input source.
  */
  const handleMouseDown = (note) => {
    inputManager.handleNoteOn(note);
  };

  const handleMouseUp = (note) => {
    inputManager.handleNoteOff(note);
  };

  return (
    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
      {/* Map over the static array of 88 keys defined in keyMap.js */}
      {KEY_MAP.map((keyData, index) => {
        const isActive = activeNoteSet.has(keyData.note);
        
        // Calculate dynamic CSS `left` and `width` values
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
The vertical keyboard axis for the Piano Roll grid, rendering white and black keys.

Data Flow:
`currentNotes` prop (from parent) -> `Set` -> Determines `isActive` -> Passes to `WhiteKey`/`BlackKey` components.
User Clicks -> `handleMouseDown` -> `inputManager.handleNoteOn`.

React Concepts Used:
- Dynamic rendering of lists (`.map`).
- Event handler passing.
*/
