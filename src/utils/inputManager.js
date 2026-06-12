import { useMidiStore } from "../stores/midiStore";
import { playSingleNote, stopNote } from "./audioEngine";

export const inputManager = {
  handleNoteOn: (note) => {
    const store = useMidiStore.getState();
    const { playedNotes, setPlayedNotes, registerKeyPress } = store;

    const nextPlayed = new Set(playedNotes).add(note);
    setPlayedNotes(nextPlayed);

    playSingleNote({ note, duration: "8n" });

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
