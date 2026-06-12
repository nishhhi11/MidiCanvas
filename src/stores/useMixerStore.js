import { create } from 'zustand';

export const useMixerStore = create((set) => ({
  mutedTracks: new Set(),
  soloedTracks: new Set(),
  masterVolume: 1.0,
  trackVolumes: {},
  trackColors: {},

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
