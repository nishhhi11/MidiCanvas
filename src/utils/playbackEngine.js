let Tone = null;
import { initializeAudioEngine, getSynth, stopAllAudio, triggerCustomAttackRelease } from "./audioEngine";

/*
PURPOSE:
These variables cache the mixer states (muting, soloing, volumes) locally within this file.

WHY IT EXISTS:
Since `Tone.Transport.schedule` registers callbacks that execute in the future (managed by Web Audio API), they need access to the *latest* mixer states precisely at the moment they fire. Storing these locally avoids React re-render closure staleness.
*/
let mutedTracksSet = new Set();
let soloedTracksSet = new Set();
let trackVolumesData = {};

export function setTrackStates(muted, soloed, volumes = {}) {
  mutedTracksSet = muted;
  soloedTracksSet = soloed;
  trackVolumesData = volumes;
}

/*
PURPOSE:
Adjusts the global volume of the application.

REACT/JS CONCEPT:
Logarithmic volume scaling.

VIVA QUESTION:
Why do you use `20 * Math.log10(val)` for volume instead of just setting it linearly?

VIVA ANSWER:
Human hearing is logarithmic, not linear. If we set audio volume linearly, a slider at 50% would still sound extremely loud, and all the perceived volume change would happen in the bottom 10% of the slider. The Decibel (dB) scale converts the linear 0.0 to 1.0 slider value into an acoustic curve that sounds natural to human ears.
*/
export function setMasterVolume(val) {
  if (!Tone) return;

  if (val <= 0) {
    Tone.Destination.mute = true;
  } else {
    Tone.Destination.mute = false;
    Tone.Destination.volume.value = 20 * Math.log10(val);
  }
}

let metronomeSynth = null;

/*
PURPOSE:
Initializes Tone.js dynamically and sets up the metronome synthesizer.

WHY IT EXISTS:
Browsers strictly enforce a "User Gesture" policy: Web Audio API cannot start until the user clicks or interacts with the page. We delay initialization until the Play button is pressed.
*/
export async function initializeAudio() {
  Tone = await import("tone"); // Dynamic import for performance
  await initializeAudioEngine();
  
  if (!metronomeSynth) {
    metronomeSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
    }).toDestination();
    metronomeSynth.volume.value = -10;
  }
}

/*
PURPOSE:
The core playback scheduling function. It takes the array of JSON notes and schedules them on the Tone.js timeline.

INPUT:
`notes`: Array of note objects.
`tempo`, `timeSignature`, `duration`: Song metadata.
`isMetronomeOn`: Boolean.

REACT CONCEPT:
Pure imperative JavaScript. This function sits outside the React lifecycle.
*/
export function playMidi(notes, tempo = 120, timeSignature = "4/4", duration = 0, isMetronomeOn = false, playbackRate = 1.0, autoStart = true) {
  const synth = getSynth();
  if (!synth) {
    console.warn("Audio not initialized. Ensure initializeAudio() is called first.");
    return;
  }

  if (!Tone) return;

  // Clear any previously scheduled events to avoid overlapping ghost notes
  Tone.Transport.cancel();

  /*
  PURPOSE:
  Schedules metronome clicks.
  
  ALGORITHM:
  Calculates the duration of one beat based on the tempo (BPM).
  Loops from time=0 to the end of the song, scheduling a high pitch click (C3) on downbeats and lower pitch (G2) on offbeats.
  */
  if (isMetronomeOn && tempo > 0 && duration > 0) {
    const beatDuration = 60 / tempo;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0]) || 4;

    for (let t = 0; t <= duration + beatDuration; t += beatDuration) {
      const beatIndex = Math.round(t / beatDuration);
      const isDownbeat = beatIndex % beatsPerMeasure === 0;

      Tone.Transport.schedule((time) => {
        if (metronomeSynth) {
          metronomeSynth.triggerAttackRelease(isDownbeat ? "C3" : "G2", "32n", time, isDownbeat ? 0.8 : 0.4);
        }
      }, t / playbackRate);
    }
  }

  /*
  PURPOSE:
  Schedules every MIDI note.
  
  VIVA QUESTION:
  If a song has 10,000 notes, won't scheduling them all at once crash the browser?
  
  VIVA ANSWER:
  No. `Tone.Transport.schedule` does not play the notes immediately. It registers a lightweight callback function with the Web Audio API's highly optimized scheduling queue. The browser handles firing these callbacks exactly when the internal audio clock reaches `note.time`.
  */
  notes.forEach((note) => {
    Tone.Transport.schedule((time) => {
      // Check muting/soloing at the exact moment the note is supposed to play
      const isActive = soloedTracksSet.size > 0 
        ? soloedTracksSet.has(note.track) 
        : !mutedTracksSet.has(note.track);

      if (!isActive) return;

      const trackVol = trackVolumesData[note.track] !== undefined ? trackVolumesData[note.track] : 1.0;
      const finalVelocity = (note.velocity || 0.7) * trackVol;

      if (finalVelocity > 0) {
        triggerCustomAttackRelease(note.name, note.duration / playbackRate, time, finalVelocity);
      }
    }, note.time / playbackRate);
  });

  // Start the master audio clock
  if (autoStart) {
    Tone.Transport.start();
  }
}

export function pauseMidi() {
  if (!Tone) return;
  Tone.Transport.pause();
}

export function stopMidi() {
  if (Tone) {
    Tone.Transport.stop(); // Stops clock
    Tone.Transport.cancel(); // Clears scheduled events
  }
  stopAllAudio(); // Kills currently sounding synths
}

export function resumeMidi() {
  if (!Tone) return;
  Tone.Transport.start();
}

export function getCurrentTime() {
  return Tone ? Tone.Transport.seconds : 0;
}

export function seek(time) {
  if (!Tone) return;
  Tone.Transport.seconds = time;
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Acts as the central imperative controller for Tone.js and the Web Audio API. It schedules notes, manages the metronome, and handles transport controls (play, pause, stop, seek).

Data Flow:
React components call functions (e.g. `playMidi`) -> This file calculates timing and registers callbacks with `Tone.Transport.schedule` -> Web Audio API's internal clock fires the callbacks -> `audioEngine.js` generates the sound.

Important Variables:
- `Tone`: The dynamically imported Tone.js library.
- `metronomeSynth`: A dedicated synthesizer for metronome clicks.
- `mutedTracksSet`, `soloedTracksSet`: Local caches of mixer states to ensure scheduled callbacks read the latest data when they fire.

Important Functions:
- `initializeAudio`: Dynamically loads Tone.js to bypass browser autoplay restrictions.
- `playMidi`: The core scheduling engine that places every note onto the Tone.js Transport timeline.
- `setMasterVolume`: Uses logarithmic scaling for natural volume control.

React Concepts Used:
- None directly. This file acts as the bridge *away* from React's declarative world into imperative JavaScript.

JavaScript Concepts Used:
- Dynamic Imports (`await import("tone")`) for code-splitting.
- Closures (callbacks inside `Tone.Transport.schedule` accessing local variables).
- Math (`Math.log10`) for audio decibel conversion.

Browser APIs Used:
- Web Audio API (abstracted by Tone.js).

Performance Considerations:
- **Dynamic Import:** `tone.js` is a heavy library. By importing it dynamically in `initializeAudio`, the initial page load time is significantly reduced.
- **Scheduling Overhead:** Tone.js handles 10,000+ scheduled events efficiently, but the `forEach` loop in `playMidi` does lock the main thread briefly while setting up the schedule.

Most Likely Viva Questions:
1. Explain how the volume scaling works in `setMasterVolume`.
2. Why is `Tone` imported dynamically?
3. How do you handle a track being muted *while* the song is already playing?

Tricky Follow-Up Questions:
1. Why do you need `trackVolumesData` in this file if it's already in the Zustand store?
2. What happens to notes that were scheduled to play, but the user clicks 'Stop'?

Expected Answers:
1. Human hearing is logarithmic. A linear slider would sound disproportionate. Using `20 * Math.log10(val)` converts a linear 0-1 range into a logarithmic Decibel (dB) scale.
2. For performance and browser policy. Tone.js is large, so dynamic imports split the bundle size. Also, browsers block audio contexts created before a user interaction; loading it on Play guarantees interaction.
3. The `Tone.Transport.schedule` callback checks `mutedTracksSet` *inside* the callback function. When the internal clock reaches a note, it checks the *current* state of the set. If it's muted, the callback simply `returns` without triggering the synth.
4. *Follow-up 1:* The scheduled callbacks run outside of React's lifecycle. We use `setTrackStates` to push Zustand updates into this file's local variables so the closures can access fresh data when they execute.
5. *Follow-up 2:* We call `Tone.Transport.cancel()`, which completely clears the scheduling queue in Tone.js, preventing them from firing. We also call `stopAllAudio()` to silence notes that are currently mid-sustain.
*/