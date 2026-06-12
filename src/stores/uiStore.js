import { create } from 'zustand';

export const useUIStore = create((set) => ({
  mode: 'studio', 
  setMode: (m) => set({ mode: m }),
}));
