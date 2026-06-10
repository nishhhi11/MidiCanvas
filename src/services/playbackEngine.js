import * as Tone from "tone";
import { initializeAudioEngine, getSynth, stopAllAudio } from "./audioEngine";

export async function initializeAudio() {
  await initializeAudioEngine();
}
export function playMidi(notes) {
  const synth = getSynth();
  if (!synth) {
    console.warn("Audio not initialized. Ensure initializeAudio() is called first.");
    return;
  }

  // Clear any previously scheduled events from the Transport timeline
  Tone.Transport.cancel();

  // Schedule every note onto the Transport timeline
  notes.forEach((note) => {
    Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(note.name, note.duration, time, note.velocity || 0.7);
    }, note.time);
  });

  // Begin playback
  Tone.Transport.start();
}

export function pauseMidi() {
  Tone.Transport.pause();
}

export function stopMidi() {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  stopAllAudio();
}

export function setPlaybackSpeed(speed) {
  Tone.Transport.playbackRate = speed;
}

export function resumeMidi() {
  Tone.Transport.start();
}

export function getCurrentTime() {
  return Tone.Transport.seconds;
}

export function seek(time) {
  Tone.Transport.seconds = time;
}