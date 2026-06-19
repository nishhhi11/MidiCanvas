# FILE SUMMARY: src/utils/audioEngine.js

## Purpose
A custom, high-performance polyphonic synthesizer built directly on the raw Web Audio API. It implements an Object Pool and Voice Stealing algorithm to play thousands of notes without stuttering.

## Data Flow
`playbackEngine.js` calls `triggerCustomAttackRelease` -> Engine finds a free Voice -> Creates an Oscillator -> Shapes volume using Gain Nodes (ADSR Envelope) -> Routes to Master Output.

## Important Variables
- `voices`: An array of 128 pre-allocated objects containing GainNodes and state tracking.
- `MAX_VOICES`: Hard limit to prevent CPU crashes.

## Important Functions
- `initializeAudioEngine`: Pre-allocates the audio graph.
- `triggerCustomAttackRelease`: The core synthesis logic that schedules the Oscillator and ADSR envelope.
- `stopAllAudio`: Panic button to kill all sound instantly.

## React Concepts Used
- None. This is pure Web Audio API architecture.

## JavaScript Concepts Used
- Object Pool Design Pattern.
- Standard Math (`Math.pow`) for frequency conversion.

## Browser APIs Used
- Web Audio API (`audioCtx.createGain`, `createOscillator`, `setValueAtTime`, `linearRampToValueAtTime`).

## Performance Considerations
- **Object Pooling vs Instantiation:** Standard Tone.js synths instantiate new full audio graphs per note. This custom engine pre-allocates Gain nodes and only instantiates lightweight Oscillators, significantly reducing Garbage Collection pressure.
- **Voice Stealing:** By limiting to 128 voices, it guarantees the browser tab will never run out of memory or CPU, even on complex Rachmaninoff MIDI files.

## Most Likely Viva Questions
1. What is an Object Pool pattern, and why did you use it here?
2. What is Voice Stealing?
3. How do you convert a MIDI note to a frequency?

## Tricky Follow-Up Questions
1. Why do you use `exponentialRampToValueAtTime` for the audio release instead of `linearRamp`?
2. Why not just pre-allocate the Oscillators too?

## Expected Answers
1. Creating and destroying objects (like AudioNodes) rapidly causes the browser's Garbage Collector to pause the thread, causing audio stutter. An Object Pool pre-creates a set number of objects (128 voices) at startup, and reuses them over and over, keeping memory usage flat.
2. Synthesizers have limited polyphony (128 notes). If a 129th note is requested, Voice Stealing looks for the oldest playing note, forcefully stops it, and gives its hardware slot to the new note, preventing crashes.
3. Using the formula: f = 440 * 2^((MIDI_Note - 69) / 12).
4. *Follow-up 1:* Sound decay is perceived logarithmically by the human ear. A linear volume fade sounds unnatural and abrupt at the very end.
5. *Follow-up 2:* In the Web Audio API, an OscillatorNode is a "one-shot" object. Once you call `.stop()`, it cannot be restarted. Therefore, we *must* create a new Oscillator for every note, but we reuse the much heavier GainNode routing graph.
