import { useState, useEffect, useRef } from "react";
import FallingNotes from "./FallingNotes";
import PianoKeyboard from "./PianoKeyboard";
import { generatePianoRollData } from "../../services/pianoRollGenerator";
import { KEY_MAP } from "./keyMap";
import { useMidiStore } from "../../store/midiStore";
import { inputManager } from "../../services/inputManager";

const PIXELS_PER_SECOND = 150;

export default function PianoRoll({ rawNotes, currentTime }) {
  const [rollData, setRollData] = useState(null);
  
  // Process the raw MIDI notes into render-ready data once
  useEffect(() => {
    if (rawNotes && rawNotes.length > 0) {
      setRollData(generatePianoRollData(rawNotes));
    }
  }, [rawNotes]);

  // Determine which keys are currently "hitting" the line from playback
  let playbackActiveNotes = [];
  if (rollData && rollData.notes) {
    playbackActiveNotes = rollData.notes.filter(n => currentTime >= n.startTime && currentTime <= n.endTime);
  }

  // Handle computer keyboard input synced to global store
  const { playedNotes } = useMidiStore();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return; // Prevent browser key repeat spam
      const key = e.key.toUpperCase();
      const mappedKey = KEY_MAP.find(k => k.pcKey === key);
      
      if (mappedKey) {
        inputManager.handleNoteOn(mappedKey.note);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toUpperCase();
      const mappedKey = KEY_MAP.find(k => k.pcKey === key);
      
      if (mappedKey) {
        inputManager.handleNoteOff(mappedKey.note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Merge playback active notes and manual active notes for the UI
  const allActiveNoteObjects = [
    ...playbackActiveNotes.map(n => ({ name: n.note })),
    ...Array.from(playedNotes).map(n => ({ name: n }))
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Falling Notes Area */}
      {rollData && (
        <FallingNotes 
          notes={rollData.notes} 
          currentTime={currentTime} 
          PIXELS_PER_SECOND={PIXELS_PER_SECOND}
        />
      )}
      
      {/* Hit Line */}
      <div className="h-1 w-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10" />

      {/* Keyboard */}
      <PianoKeyboard currentNotes={allActiveNoteObjects} />
    </div>
  );
}
