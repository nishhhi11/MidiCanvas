import { create } from 'zustand';

export const usePlaybackStore = create((set) => ({
  playbackState: 'stopped', 
  currentTime: 0,
  activeNotes: [],
  isLooping: false,
  playbackRate: 1.0,
  loopStart: 0,
  loopEnd: 0,
  isMetronomeOn: false,

  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setPlaybackState: (state) => set({ playbackState: state }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setActiveNotes: (notes) => set({ activeNotes: notes }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  toggleMetronome: () => set((state) => ({ isMetronomeOn: !state.isMetronomeOn })),
  setLoopPoints: (start, end) => set({ loopStart: start, loopEnd: end }),
  resetPlayback: () => set({ playbackState: 'stopped', currentTime: 0, activeNotes: [], playbackRate: 1.0, loopStart: 0, loopEnd: 0, isMetronomeOn: false }),
}));
