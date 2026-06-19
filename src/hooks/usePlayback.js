import { useEffect, useCallback, useRef } from 'react';
import { usePlaybackStore } from '../stores/playbackStore';
import { useMidiStore } from '../stores/midiStore';
import { useMixerStore } from '../stores/useMixerStore';
import { 
  initializeAudio, 
  playMidi, 
  pauseMidi, 
  stopMidi, 
  resumeMidi, 
  getCurrentTime,
  seek,
  setTrackStates,
  setMasterVolume
} from '../utils/playbackEngine';

/*
PURPOSE:
A central controller Hook that bridges React state (Zustand) with the imperative Tone.js audio engine (`playbackEngine.js`).

WHY IT EXISTS:
React is declarative, while audio engines like Tone.js are highly imperative (play(), stop(), seek()). This hook listens to changes in React state (like muting a track or changing volume) and imperatively commands the audio engine. It also runs the animation loop to update the UI timeline based on the audio engine's clock.

REACT CONCEPT:
Hooks orchestration (`useEffect`, `useCallback`, `useRef`). Synchronizing React with external systems.

VIVA QUESTION:
Why do you need `requestAnimationFrame` here if React is state-driven?

VIVA ANSWER:
React state updates are too slow and erratic for smooth 60fps animations. If we updated the `currentTime` state using a `setInterval`, the playhead would stutter. `requestAnimationFrame` ensures the timeline updates exactly before the browser repaints, keeping the UI perfectly synced with the audio engine's precision clock.
*/
export function usePlaybackController() {
  const { midiData } = useMidiStore();
  const { mutedTracks, soloedTracks, masterVolume, trackVolumes } = useMixerStore();
  const { 
    playbackState, setPlaybackState, 
    setCurrentTime, setActiveNotes, 
    isLooping, playbackRate,
    loopStart, loopEnd, isMetronomeOn
  } = usePlaybackStore();

  const notes = midiData?.notes || [];
  
  /*
  PURPOSE:
  Stores the ID of the current animation frame.
  WHY IT EXISTS: So we can cancel it when the component unmounts or playback stops, preventing memory leaks and ghost loops.
  */
  const requestRef = useRef();

  /*
  PURPOSE: Synchronize mixer state with the audio engine.
  */
  useEffect(() => {
    setTrackStates(mutedTracks, soloedTracks, trackVolumes);
  }, [mutedTracks, soloedTracks, trackVolumes]);

  useEffect(() => {
    setMasterVolume(masterVolume);
  }, [masterVolume]);

  const previousRate = useRef(playbackRate);

  useEffect(() => {
    if (previousRate.current !== playbackRate) {
      if (playbackState === 'playing' || playbackState === 'paused') {
        const uiTime = getCurrentTime() * previousRate.current;
        stopMidi(); // Clears scheduled events
        
        const tempo = midiData?.tempo || 120;
        const timeSig = midiData?.timeSignature || "4/4";
        const duration = midiData?.duration || 0;
        
        playMidi(notes, tempo, timeSig, duration, isMetronomeOn, playbackRate, playbackState === 'playing');
        seek(uiTime / playbackRate);
      }
      previousRate.current = playbackRate;
    }
  }, [playbackRate, playbackState, notes, midiData, isMetronomeOn]);

  /*
  PURPOSE: Stops audio and resets UI state.
  */
  const handleStop = useCallback(() => {
    stopMidi();
    setCurrentTime(0);
    setActiveNotes([]);
    setPlaybackState('stopped');
  }, [setCurrentTime, setActiveNotes, setPlaybackState]);

  /*
  PURPOSE:
  The core render loop for playback. Updates the current time and calculates which notes are currently sounding.
  */
  const updateTimeline = useCallback(() => {
    if (playbackState === 'playing') {
      // 1. Get the highly accurate time from Tone.js
      const rawTime = getCurrentTime();
      const time = rawTime * playbackRate; // UI time scales with playback rate
      
      // 2. Update Zustand store (moves the UI playhead)
      setCurrentTime(time);

      // 3. Loop logic calculation
      const maxTime = notes.length > 0 ? Math.max(...notes.map(n => n.time + n.duration)) : 0;
      const effectiveLoopEnd = loopEnd > 0 ? loopEnd : maxTime;

      // Check if we hit the end
      if (time >= effectiveLoopEnd) {
        if (isLooping) {
          seek(loopStart / playbackRate); // seek uses raw Tone time
          setCurrentTime(loopStart); // immediately snap UI to avoid jitter
        } else if (time >= maxTime) {
          handleStop();
          return;
        }
      }

      // 4. Calculate which notes are currently "playing" to light up the piano keys
      // PERFORMANCE: This is an O(N) filter running 60 times a second.
      // For massive files, this could be optimized using an Interval Tree or binary search.
      const active = notes.filter(n => {
        if (time < n.time || time >= n.time + n.duration) return false;
        if (soloedTracks.size > 0) return soloedTracks.has(n.track);
        return !mutedTracks.has(n.track);
      });
      setActiveNotes(active);

      // 5. Schedule the next frame
      requestRef.current = requestAnimationFrame(updateTimeline);
    }
  }, [playbackState, notes, isLooping, loopStart, loopEnd, handleStop, mutedTracks, soloedTracks, setCurrentTime, setActiveNotes, playbackRate]);

  /*
  PURPOSE:
  Starts or stops the animation loop whenever the `playbackState` changes.
  
  REACT CONCEPT:
  `useEffect` cleanup function to prevent memory leaks.
  */
  useEffect(() => {
    if (playbackState === 'playing') {
      requestRef.current = requestAnimationFrame(updateTimeline);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [playbackState, updateTimeline]);

  /*
  PURPOSE:
  Handles the play button click.
  */
  const handlePlay = useCallback(async () => {
    if (!notes || notes.length === 0) return;

    // Web Audio API requires a user interaction before it can play sound.
    await initializeAudio();

    if (playbackState === 'paused') {
      resumeMidi();
    } else {
      const tempo = midiData?.tempo || 120;
      const timeSig = midiData?.timeSignature || "4/4";
      const duration = midiData?.duration || 0;
      playMidi(notes, tempo, timeSig, duration, isMetronomeOn, playbackRate, true);
    }
    setPlaybackState('playing');
  }, [notes, playbackState, setPlaybackState, midiData, isMetronomeOn, playbackRate]);

  const handlePause = useCallback(() => {
    pauseMidi();
    setPlaybackState('paused');
  }, [setPlaybackState]);

  const handleSeek = useCallback((time) => {
    seek(time / playbackRate);
    setCurrentTime(time);
  }, [setCurrentTime, playbackRate]);

  return { handlePlay, handlePause, handleStop, handleSeek };
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A controller hook that synchronizes the React application state (Zustand) with the imperative Web Audio API / Tone.js engine. It handles playback controls, animation loops, and note-activation logic.

Data Flow:
User clicks Play -> `handlePlay` calls `initializeAudio()` and `playMidi()` -> Sets `playbackState` to 'playing' -> `useEffect` triggers `requestAnimationFrame(updateTimeline)` -> Timeline updates `currentTime` and `activeNotes` 60 times a second -> UI re-renders.

Important Variables:
- `requestRef`: A `useRef` holding the animation frame ID to allow cancellation.
- `activeNotes`: An array of notes that are currently sounding at the exact `currentTime`.

Important Functions:
- `updateTimeline`: The 60fps render loop.
- `handlePlay`, `handlePause`, `handleStop`, `handleSeek`: Exposes imperative controls to UI buttons.

React Concepts Used:
- `useEffect` for synchronizing external systems (Tone.js engine).
- `useRef` for keeping mutable values (frame ID) that don't trigger re-renders.
- `useCallback` for memoizing event handlers.

JavaScript Concepts Used:
- `requestAnimationFrame` (Browser API)
- Array filtering (`filter`, `map`)

Browser APIs Used:
- Web Audio API (implicitly via `initializeAudio`)
- `requestAnimationFrame` / `cancelAnimationFrame`

Performance Considerations:
- **`requestAnimationFrame` vs `setInterval`:** rAF is synced with monitor refresh rate (typically 60Hz), pauses when the tab is inactive (saving battery/CPU), and provides smoother visual updates.
- **Filtering Active Notes:** The `filter` inside `updateTimeline` runs 60 times a second. If the MIDI file has 50,000 notes, filtering the entire array 60 times a second is highly CPU intensive. A future optimization would be an Interval Tree or keeping a sorted array and using binary search.

Most Likely Viva Questions:
1. Explain the role of `useEffect` in this file.
2. Why is `requestRef` used instead of a standard `let` variable or `useState`?
3. How are you determining which notes light up on the piano keyboard?

Tricky Follow-Up Questions:
1. What happens to `requestAnimationFrame` if the user switches to a different browser tab? (Answer: The browser drastically throttles or pauses it to save resources, which is why we must rely on Tone.js's internal clock rather than counting frames).
2. How would you optimize the `notes.filter` block for a song with 100,000 notes?

Expected Answers:
1. React components are declarative. Tone.js is imperative. `useEffect` is used to sync the declarative React state (e.g., volume slider changes) with the imperative engine (e.g., `setMasterVolume`).
2. A `let` variable would reset on every re-render. `useState` would trigger *another* re-render every time we saved the frame ID, causing an infinite loop. `useRef` persists the ID across renders without triggering a re-render.
3. Every frame, we filter the entire notes array. If the `currentTime` falls between a note's `time` and `time + duration`, and the track isn't muted, it is pushed to the `activeNotes` Zustand store, which the Piano Keyboard component listens to.
4. *Follow-up 2:* I would sort the notes by start time, and maintain an index of the "current" notes. As the playhead moves forward, I only check the next few notes in the array rather than scanning all 100,000 every single frame.
*/
