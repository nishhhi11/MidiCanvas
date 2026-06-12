import { create } from 'zustand';

const MAX_HISTORY = 50;

export const useMidiStore = create((set) => ({
  midiData: null,
  uploadedFile: null,
  isParsing: false,
  history: { past: [], future: [] },

  setIsParsing: (isParsing) => set({ isParsing }),
  setMidiData: (data) => set({ midiData: data, history: { past: [], future: [] } }),
  setUploadedFile: (fileName) => set({ uploadedFile: fileName }),
  clearMidiData: () => set({ midiData: null, uploadedFile: null, isParsing: false, history: { past: [], future: [] } }),
  updateMidiMetadata: (updates) => set((state) => {
    if (!state.midiData) return state;
    return { midiData: { ...state.midiData, ...updates } };
  }),

  updateNote: (id, updates) => set((state) => {
    if (!state.midiData || !state.midiData.notes) return state;
    
    // Save history
    const past = [...state.history.past, state.midiData.notes].slice(-MAX_HISTORY);
    
    const newNotes = state.midiData.notes.map(n => n.id === id ? { ...n, ...updates } : n);
    return { 
      midiData: { ...state.midiData, notes: newNotes },
      history: { past, future: [] }
    };
  }),

  deleteNote: (id) => set((state) => {
    if (!state.midiData || !state.midiData.notes) return state;
    
    // Save history
    const past = [...state.history.past, state.midiData.notes].slice(-MAX_HISTORY);

    const newNotes = state.midiData.notes.filter(n => n.id !== id);
    return { 
      midiData: { ...state.midiData, notes: newNotes },
      history: { past, future: [] }
    };
  }),

  undo: () => set((state) => {
    if (state.history.past.length === 0 || !state.midiData) return state;
    
    const previousNotes = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    const newFuture = [state.midiData.notes, ...state.history.future];
    
    return {
      midiData: { ...state.midiData, notes: previousNotes },
      history: { past: newPast, future: newFuture }
    };
  }),

  redo: () => set((state) => {
    if (state.history.future.length === 0 || !state.midiData) return state;
    
    const nextNotes = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    const newPast = [...state.history.past, state.midiData.notes];
    
    return {
      midiData: { ...state.midiData, notes: nextNotes },
      history: { past: newPast, future: newFuture }
    };
  }),
}));
