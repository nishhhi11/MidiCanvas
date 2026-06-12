import { create } from 'zustand';

export const useUIStore = create((set) => ({
  mode: 'studio', // 'studio' | 'tutor'
  setMode: (m) => set({ mode: m }),
}));
