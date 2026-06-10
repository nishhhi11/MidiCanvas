import * as Tone from "tone";

let synth = null;
let isInitialized = false;

export async function initializeAudioEngine() {
  if (isInitialized) return;
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    }
  }).toDestination();
  isInitialized = true;
}

export function getSynth() {
  return synth;
}

export function playSingleNote(noteData) {
  if (!synth) return;
  const { note, duration = "8n" } = noteData;
  synth.triggerAttackRelease(note, duration);
}

export function playChord(notesData) {
  if (!synth) return;
  const notes = notesData.map(n => n.note);
  // Default duration for now, can be extracted from notesData
  synth.triggerAttackRelease(notes, "8n");
}

export function stopNote(noteData) {
  if (!synth) return;
  synth.triggerRelease(noteData.note);
}

export function stopAllAudio() {
  if (synth) {
    synth.releaseAll();
  }
}
