import { useMidiStore } from "../stores/midiStore";
import { playSingleNote, stopNote } from "./audioEngine";

/*
PURPOSE:
A central controller for handling real-time piano key presses (from mouse, physical keyboard, or potentially MIDI hardware).

VIVA QUESTION:
Why do you use a `Set` for `playedNotes` instead of an array?

VIVA ANSWER:
A `Set` automatically guarantees uniqueness. If a user mashes the same key multiple times or if keyboard events fire rapidly (key repeat), we only want to track that the note is "currently pressed" once. `Set` lookups and deletions are also O(1) time complexity, making it highly efficient.
*/
export const inputManager = {
  handleNoteOn: (note) => {
    // Accessing Zustand store outside of React components
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
Routes real-time hardware/UI inputs to both the AudioEngine (for sound) and the Zustand store (for visual feedback).
*/
