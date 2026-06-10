import * as Tone from "tone";

let synth = null;

export async function initializeAudio() {
  // Browsers require a user interaction to start audio. 
  // Calling Tone.start() resumes the AudioContext.
  await Tone.start();
  
  if (!synth) {
    // PolySynth allows playing multiple notes simultaneously (chords)
    synth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      }
    }).toDestination();
    
    // Lower volume slightly to prevent clipping on dense MIDI files
    synth.volume.value = -8; 
  }
}

export function playMidi(notes) {
  if (!synth) {
    console.warn("Audio not initialized. Ensure initializeAudio() is called first.");
    return;
  }

  // Clear any previously scheduled events from the Transport timeline
  Tone.Transport.cancel();

  // Schedule every note onto the Transport timeline
  notes.forEach((note) => {
    Tone.Transport.schedule((time) => {
      // Trigger the note at the precisely scheduled `time`
      // note.name = "C4", note.duration = 0.5s, velocity is scaled slightly
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
  // Stop the timeline progression
  Tone.Transport.stop();
  
  // Wipe all scheduled future events
  Tone.Transport.cancel();
  
  // Immediately silence any notes currently ringing out
  if (synth) {
    synth.releaseAll();
  }
}

export function getCurrentTime() {
  return Tone.Transport.seconds;
}