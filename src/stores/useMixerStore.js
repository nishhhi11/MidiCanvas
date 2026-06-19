import { create } from 'zustand';

/*
PURPOSE:
A Zustand global store managing audio mixer states, such as volume levels, track muting, and track colors.

REACT CONCEPT:
Global State Management.

VIVA QUESTION:
Why use a `Set` for `mutedTracks` and `soloedTracks` instead of an array?

VIVA ANSWER:
Performance. We need to frequently check if a track is muted during high-speed audio playback (e.g., inside Tone.Transport.schedule callbacks). A `Set` allows O(1) lookup time using `.has()`, whereas an array `.includes()` would be O(N) and slow down the audio engine.
*/
export const useMixerStore = create((set) => ({
  mutedTracks: new Set(),
  soloedTracks: new Set(),
  masterVolume: 1.0,
  trackVolumes: {},
  trackColors: {},

  /*
  PURPOSE:
  Toggles the mute state for a specific track ID.

  ALGORITHM:
  Since Zustand state is immutable, we create a *new* Set, copy the old values, toggle the specific track ID, and return the new Set to trigger a React re-render.
  */
  toggleMute: (trackId) => set((state) => {
    const newMuted = new Set(state.mutedTracks);
    if (newMuted.has(trackId)) newMuted.delete(trackId);
    else newMuted.add(trackId);
    return { mutedTracks: newMuted };
  }),

  toggleSolo: (trackId) => set((state) => {
    const newSoloed = new Set(state.soloedTracks);
    if (newSoloed.has(trackId)) newSoloed.delete(trackId);
    else newSoloed.add(trackId);
    return { soloedTracks: newSoloed };
  }),

  setMasterVolume: (volume) => set({ masterVolume: volume }),

  setTrackVolume: (trackId, volume) => set((state) => ({
    trackVolumes: { ...state.trackVolumes, [trackId]: volume }
  })),

  setTrackColor: (trackId, color) => set((state) => ({
    trackColors: { ...state.trackColors, [trackId]: color }
  })),

  clearMixer: () => set({ 
    mutedTracks: new Set(), 
    soloedTracks: new Set(), 
    masterVolume: 1.0, 
    trackVolumes: {},
    trackColors: {} 
  }),
}));

/*
========================================
FILE SUMMARY
========================================

Purpose:
Manages the audio mixer state globally.

Data Flow:
Mixer UI sliders/buttons -> Call setters here -> Store updates -> Re-renders UI and triggers audio engine to apply volume changes.

Important Variables:
- `mutedTracks`, `soloedTracks`: Sets tracking which tracks are silenced or soloed.

React Concepts Used:
- Global State with Zustand.
- Immutability (creating new Sets instead of modifying the existing one).

Most Likely Viva Questions:
1. How does muting work logically?

Expected Answers:
1. When a note is about to play, the audio engine checks this store's `mutedTracks` and `soloedTracks`. If the note's track ID is in `mutedTracks`, or if `soloedTracks` has items but doesn't include this track ID, the note is skipped.
*/
