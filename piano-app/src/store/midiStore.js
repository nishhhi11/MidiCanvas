import { create } from "zustand";

export const useMidiStore = create((set) => ({
  midiFile: null,

  midiData: null,

  isParsing: false,

  setMidiFile: (file) =>
    set({ midiFile: file }),

  setMidiData: (data) =>
    set({ midiData: data }),

  setIsParsing: (value) =>
    set({ isParsing: value }),

  analysis: null,

  setAnalysis: (analysis) =>
    set({ analysis }),

  lesson: null,
  
  setLesson: (lesson) =>
    set({ lesson }),

  currentTime: 0,
  
  setCurrentTime: (time) =>
    set({ currentTime: time }),
    
  isPlaying: false,
  
  setIsPlaying: (playing) =>
    set({ isPlaying: playing }),
}));
