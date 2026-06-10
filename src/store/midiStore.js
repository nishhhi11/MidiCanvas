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

  learningConfig: { mode: "performance", speed: 1.0 },
  setLearningConfig: (config) =>
    set((state) => ({ learningConfig: { ...state.learningConfig, ...config } })),

  expectedNotes: [],
  setExpectedNotes: (notes) =>
    set({ expectedNotes: notes }),

  playedNotes: new Set(),
  setPlayedNotes: (notesSet) =>
    set({ playedNotes: notesSet }),

  feedbackState: "idle", // "idle" | "perfect" | "incorrect"
  setFeedbackState: (state) =>
    set({ feedbackState: state }),

  performanceStats: {
    perfect: 0,
    good: 0,
    miss: 0,
    combo: 0,
    maxCombo: 0,
    firstTryCorrect: 0,
    totalPrompts: 0,
  },
  setPerformanceStats: (updater) =>
    set((state) => ({
      performanceStats: typeof updater === "function" ? updater(state.performanceStats) : { ...state.performanceStats, ...updater }
    })),

  hitHistory: [],
  addHitHistory: (hit) =>
    set((state) => ({ hitHistory: [...state.hitHistory, hit] })),

  activeScoringWindow: [],
  setActiveScoringWindow: (window) =>
    set({ activeScoringWindow: window }),

  sessionComplete: false,
  setSessionComplete: (complete) =>
    set({ sessionComplete: complete }),

  activeMidiDevice: null,
  setActiveMidiDevice: (device) =>
    set({ activeMidiDevice: device }),

  midiLatency: 0,
  setMidiLatency: (latency) =>
    set({ midiLatency: latency }),

  sustainPedal: false,
  setSustainPedal: (isPressed) =>
    set({ sustainPedal: isPressed }),

  coachHistory: [],
  setCoachHistory: (history) =>
    set({ coachHistory: history }),

  // --- Phase 9: Practice Tools ---
  loopConfig: { enabled: false, start: 0, end: 0 },
  setLoopConfig: (config) => 
    set(state => ({ loopConfig: { ...state.loopConfig, ...config } })),

  activeHand: "both", // "both" | "left" | "right"
  setActiveHand: (hand) => 
    set({ activeHand: hand }),

  tempoConfig: { adaptive: false, metronome: false },
  setTempoConfig: (config) =>
    set(state => ({ tempoConfig: { ...state.tempoConfig, ...config } })),

  focusMode: false,
  setFocusMode: (isFocus) =>
    set({ focusMode: isFocus }),

  songSections: [],
  setSongSections: (sections) =>
    set({ songSections: sections }),

  activeSection: null, // id
  setActiveSection: (id) =>
    set({ activeSection: id }),

  loopMastery: { attempts: 0, perfectHits: 0, totalHits: 0 },
  setLoopMastery: (mastery) =>
    set(state => ({ loopMastery: { ...state.loopMastery, ...mastery } })),
  resetLoopMastery: () =>
    set({ loopMastery: { attempts: 0, perfectHits: 0, totalHits: 0 } }),

  resetPerformance: () =>
    set({
      performanceStats: { perfect: 0, good: 0, miss: 0, combo: 0, maxCombo: 0, firstTryCorrect: 0, totalPrompts: 0 },
      hitHistory: [],
      activeScoringWindow: [],
      sessionComplete: false,
      feedbackState: "idle",
      expectedNotes: [],
      playedNotes: new Set()
    }),

  registerKeyPress: (note) => {
    const state = useMidiStore.getState();
    const { currentTime, learningConfig, activeScoringWindow, performanceStats } = state;
    
    // Performance / Practice Mode Scoring
    if (learningConfig.mode !== "wait") {
      // Find the oldest unhit note in the active window that matches the key pressed
      const targetNoteIndex = activeScoringWindow.findIndex(n => n.note === note && !n.hit);
      
      if (targetNoteIndex !== -1) {
        const targetNote = activeScoringWindow[targetNoteIndex];
        const reactionTime = Math.abs(currentTime - targetNote.expectedTime);
        
        let result = "miss";
        if (reactionTime <= 0.05) result = "perfect";
        else if (reactionTime <= 0.12) result = "good";

        // Update stats
        if (result === "perfect" || result === "good") {
          const newCombo = performanceStats.combo + 1;
          state.setPerformanceStats(prev => ({
            ...prev,
            [result]: prev[result] + 1,
            combo: newCombo,
            maxCombo: Math.max(prev.maxCombo, newCombo)
          }));
        } else {
          state.setPerformanceStats(prev => ({ ...prev, miss: prev.miss + 1, combo: 0 }));
        }

        // Mark as hit
        const updatedWindow = [...activeScoringWindow];
        updatedWindow[targetNoteIndex] = { ...targetNote, hit: true };
        state.setActiveScoringWindow(updatedWindow);

        // Record history
        state.addHitHistory({
          note,
          expectedTime: targetNote.expectedTime,
          actualTime: currentTime,
          reactionTime,
          result
        });
      } else {
        // Pressed a key when no matching note was expected (Penalty Miss)
        state.setPerformanceStats(prev => ({ ...prev, miss: prev.miss + 1, combo: 0 }));
      }
    }
  }
}));
