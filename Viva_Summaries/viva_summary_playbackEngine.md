# FILE SUMMARY: src/utils/playbackEngine.js

## Purpose
Acts as the central imperative controller for Tone.js and the Web Audio API. It schedules notes, manages the metronome, and handles transport controls (play, pause, stop, seek).

## Data Flow
React components call functions (e.g. `playMidi`) -> This file calculates timing and registers callbacks with `Tone.Transport.schedule` -> Web Audio API's internal clock fires the callbacks -> `audioEngine.js` generates the sound.

## Important Variables
- `Tone`: The dynamically imported Tone.js library.
- `metronomeSynth`: A dedicated synthesizer for metronome clicks.
- `mutedTracksSet`, `soloedTracksSet`: Local caches of mixer states to ensure scheduled callbacks read the latest data when they fire.

## Important Functions
- `initializeAudio`: Dynamically loads Tone.js to bypass browser autoplay restrictions.
- `playMidi`: The core scheduling engine that places every note onto the Tone.js Transport timeline.
- `setMasterVolume`: Uses logarithmic scaling for natural volume control.

## React Concepts Used
- None directly. This file acts as the bridge *away* from React's declarative world into imperative JavaScript.

## JavaScript Concepts Used
- Dynamic Imports (`await import("tone")`) for code-splitting.
- Closures (callbacks inside `Tone.Transport.schedule` accessing local variables).
- Math (`Math.log10`) for audio decibel conversion.

## Browser APIs Used
- Web Audio API (abstracted by Tone.js).

## Performance Considerations
- **Dynamic Import:** `tone.js` is a heavy library. By importing it dynamically in `initializeAudio`, the initial page load time is significantly reduced.
- **Scheduling Overhead:** Tone.js handles 10,000+ scheduled events efficiently, but the `forEach` loop in `playMidi` does lock the main thread briefly while setting up the schedule.

## Most Likely Viva Questions
1. Explain how the volume scaling works in `setMasterVolume`.
2. Why is `Tone` imported dynamically?
3. How do you handle a track being muted *while* the song is already playing?

## Tricky Follow-Up Questions
1. Why do you need `trackVolumesData` in this file if it's already in the Zustand store?
2. What happens to notes that were scheduled to play, but the user clicks 'Stop'?

## Expected Answers
1. Human hearing is logarithmic. A linear slider would sound disproportionate. Using `20 * Math.log10(val)` converts a linear 0-1 range into a logarithmic Decibel (dB) scale.
2. For performance and browser policy. Tone.js is large, so dynamic imports split the bundle size. Also, browsers block audio contexts created before a user interaction; loading it on Play guarantees interaction.
3. The `Tone.Transport.schedule` callback checks `mutedTracksSet` *inside* the callback function. When the internal clock reaches a note, it checks the *current* state of the set. If it's muted, the callback simply `returns` without triggering the synth.
4. *Follow-up 1:* The scheduled callbacks run outside of React's lifecycle. We use `setTrackStates` to push Zustand updates into this file's local variables so the closures can access fresh data when they execute.
5. *Follow-up 2:* We call `Tone.Transport.cancel()`, which completely clears the scheduling queue in Tone.js, preventing them from firing. We also call `stopAllAudio()` to silence notes that are currently mid-sustain.
