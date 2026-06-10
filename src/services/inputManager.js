import { useMidiStore } from "../store/midiStore";
import { playSingleNote, stopNote } from "./audioEngine";

export const inputManager = {
  handleNoteOn: (note) => {
    const store = useMidiStore.getState();
    const { playedNotes, setPlayedNotes, registerKeyPress } = store;

    // Add note to globally tracking set
    const nextPlayed = new Set(playedNotes).add(note);
    setPlayedNotes(nextPlayed);

    // Play Audio (Duration 8n as fallback if key released too fast)
    playSingleNote({ note, duration: "8n" });

    // Validate Rhythm Hit Window / Wait Mode
    registerKeyPress(note);
  },

  handleNoteOff: (note) => {
    const store = useMidiStore.getState();
    const { playedNotes, setPlayedNotes } = store;

    const nextPlayed = new Set(playedNotes);
    nextPlayed.delete(note);
    setPlayedNotes(nextPlayed);

    stopNote({ note });
  }
};
