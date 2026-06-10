import { useEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useMidiStore } from "../store/midiStore";
import { parseMidi } from "../services/midiParser";
import { analyzeSong } from "../services/songAnalyzer";
import { generateLesson } from "../services/lessonGenerator";
import { createInteractiveLesson } from "../services/interactiveLessonEngine";
import { initializeAudio, playMidi, pauseMidi, stopMidi, getCurrentTime, resumeMidi, setPlaybackSpeed, seek } from "../services/playbackEngine";
import PianoRoll from "../components/piano/PianoRoll";
import { saveSession } from "../services/progressService";
import { useAuth } from "../context/AuthContext";
import { initializeMidiHardware } from "../services/midiInputService";
import CoachCard from "../components/coach/CoachCard";
import { calculateSections, filterNotesByHand, calculateAdaptiveTempo } from "../services/practiceToolsService";
import LoopControls from "../components/practice/LoopControls";
import HandSelector from "../components/practice/HandSelector";
import TempoControls from "../components/practice/TempoControls";
import SectionSelector from "../components/practice/SectionSelector";

export default function Upload() {
  const {
    setMidiFile, midiData, setMidiData, setIsParsing,
    analysis, setAnalysis,
    lesson, setLesson,
    currentTime, setCurrentTime,
    isPlaying, setIsPlaying,
    learningConfig, setLearningConfig,
    expectedNotes, setExpectedNotes,
    playedNotes,
    feedbackState, setFeedbackState,
    performanceStats, sessionComplete, setSessionComplete,
    activeMidiDevice, midiLatency, coachHistory,
    loopConfig, tempoConfig, focusMode, setFocusMode,
    activeHand, setSongSections, loopMastery, setLoopMastery, resetLoopMastery
  } = useMidiStore();

  const requestRef = useRef();
  const [lessonEngine, setLessonEngine] = useState(null);
  const [, setEngineUpdate] = useState(0);
  const [inputMode, setInputMode] = useState("computer");
  const nextScoringNoteIndexRef = useRef(0);
  const hasFailedCurrentPromptRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    initializeMidiHardware();
  }, []);

  const chordStepsRef = useRef([]);
  const currentStepRef = useRef(0);

  // Group notes into chords with 80ms tolerance
  useEffect(() => {
    if (lesson?.rightHandNotes) {
      const steps = [];
      let currentStep = [];
      let lastStartTime = -1;
      
      const sorted = [...lesson.rightHandNotes].sort((a,b) => a.startTime - b.startTime);

      sorted.forEach(note => {
        if (lastStartTime === -1 || Math.abs(note.startTime - lastStartTime) <= 0.08) {
          currentStep.push(note.name);
          if (lastStartTime === -1) lastStartTime = note.startTime;
        } else {
          steps.push({ startTime: lastStartTime, notes: currentStep });
          currentStep = [note.name];
          lastStartTime = note.startTime;
        }
      });
      if (currentStep.length > 0) {
        steps.push({ startTime: lastStartTime, notes: currentStep });
      }
      chordStepsRef.current = steps;
      currentStepRef.current = 0;
    }
  }, [lesson]);

  useEffect(() => {
    const updateTime = () => {
      const state = useMidiStore.getState();
      if (state.isPlaying) {
        const current = getCurrentTime();
        setCurrentTime(current);

        // Session Complete Check (if not looping entire end)
        if (lesson && current >= lesson.duration + 1 && !state.loopConfig.enabled) {
           stopMidi();
           state.setIsPlaying(false);
           state.setSessionComplete(true);
           return;
        }

        // A-B Looping & Adaptive Tempo Reset
        if (state.loopConfig.enabled && state.loopConfig.end > 0 && current >= state.loopConfig.end) {
          // Loop triggered! Apply Adaptive Tempo if enabled
          if (state.tempoConfig.adaptive) {
            const newSpeed = calculateAdaptiveTempo(state.loopMastery, state.learningConfig.speed);
            if (newSpeed !== state.learningConfig.speed) {
              setPlaybackSpeed(newSpeed);
              state.setLearningConfig({ speed: newSpeed });
            }
          }

          // Reset Mastery for next iteration
          state.resetLoopMastery();
          
          seek(state.loopConfig.start);
          setCurrentTime(state.loopConfig.start);
          nextScoringNoteIndexRef.current = 0; // Extremely naive reset (ideally find exact index)
          currentStepRef.current = 0;
          return;
        }

        // Wait Mode exact pause logic
        if (state.learningConfig.mode === "wait") {
          const nextStep = chordStepsRef.current[currentStepRef.current];
          if (nextStep && current >= nextStep.startTime) {
            pauseMidi();
            state.setIsPlaying(false);
            state.setExpectedNotes(nextStep.notes);
            state.setFeedbackState("idle");
            hasFailedCurrentPromptRef.current = false;
            state.setPerformanceStats(prev => ({ ...prev, totalPrompts: prev.totalPrompts + 1 }));
          }
        } 
        // Performance & Practice Scoring Window Logic
        else {
          let windowChanged = false;
          let currentWindow = [...state.activeScoringWindow];
          
          // 1. Add upcoming notes to the window
          if (lesson && lesson.rightHandNotes) {
            while (nextScoringNoteIndexRef.current < lesson.rightHandNotes.length) {
              const upcomingNote = lesson.rightHandNotes[nextScoringNoteIndexRef.current];
              if (current >= upcomingNote.startTime - 0.12) {
                currentWindow.push({ note: upcomingNote.name, expectedTime: upcomingNote.startTime, hit: false });
                nextScoringNoteIndexRef.current++;
                windowChanged = true;
              } else {
                break;
              }
            }
          }

          // 2. Flush notes that have passed without being hit
          const flushedWindow = currentWindow.filter(n => {
            if (!n.hit && current > n.expectedTime + 0.12) {
              state.setPerformanceStats(prev => ({ ...prev, miss: prev.miss + 1, combo: 0 }));
              state.setLoopMastery({ totalHits: state.loopMastery.totalHits + 1 });
              windowChanged = true;
              return false; // Remove from window
            }
            // Also remove notes that have been hit successfully and are now in the past
            if (n.hit && current > n.expectedTime + 0.12) {
              state.setLoopMastery({ totalHits: state.loopMastery.totalHits + 1, perfectHits: state.loopMastery.perfectHits + 1 });
              windowChanged = true;
              return false; 
            }
            return true;
          });

          if (windowChanged) {
            state.setActiveScoringWindow(flushedWindow);
          }
        }

        requestRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateTime);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, setCurrentTime]);

  // Validation logic for Wait Mode
  useEffect(() => {
    if (learningConfig.mode === "wait" && expectedNotes.length > 0) {
      const isPerfect = expectedNotes.every(n => playedNotes.has(n));
      const hasWrong = Array.from(playedNotes).some(n => !expectedNotes.includes(n));

      if (hasWrong) {
        hasFailedCurrentPromptRef.current = true;
        setFeedbackState("incorrect");
      } else if (isPerfect) {
        setFeedbackState("perfect");
        
        if (!hasFailedCurrentPromptRef.current) {
           useMidiStore.getState().setPerformanceStats(prev => ({ ...prev, firstTryCorrect: prev.firstTryCorrect + 1 }));
        }
        
        // 300ms Resume Delay for UX
        setTimeout(() => {
          setExpectedNotes([]);
          currentStepRef.current += 1;
          resumeMidi();
          setIsPlaying(true);
        }, 300);
      } else {
        setFeedbackState("idle");
      }
    }
  }, [playedNotes, expectedNotes, learningConfig.mode, setExpectedNotes, setFeedbackState, setIsPlaying]);

  const calculateGrade = () => {
    const { perfect, good, miss, firstTryCorrect, totalPrompts } = useMidiStore.getState().performanceStats;
    if (learningConfig.mode === "wait") {
      if (totalPrompts === 0) return "S";
      const score = firstTryCorrect / totalPrompts;
      if (score >= 0.95) return "S";
      if (score >= 0.90) return "A";
      if (score >= 0.80) return "B";
      if (score >= 0.70) return "C";
      return "D";
    }

    const total = perfect + good + miss;
    if (total === 0) return "S";
    const score = ((perfect * 100) + (good * 70)) / (total * 100);
    if (score >= 0.95) return "S";
    if (score >= 0.90) return "A";
    if (score >= 0.80) return "B";
    if (score >= 0.70) return "C";
    return "D";
  };

  const calculateAccuracy = () => {
    const { perfect, good, miss, firstTryCorrect, totalPrompts } = useMidiStore.getState().performanceStats;
    if (learningConfig.mode === "wait") {
      return totalPrompts === 0 ? "100" : ((firstTryCorrect / totalPrompts) * 100).toFixed(0);
    }
    const total = perfect + good + miss;
    if (total === 0) return "100";
    return (((perfect + (good * 0.5)) / total) * 100).toFixed(0);
  };

  // Save session when session is complete
  useEffect(() => {
    if (sessionComplete && user && !isSaving) {
      setIsSaving(true);
      const storeState = useMidiStore.getState();
      
      const sessionData = {
        songId: storeState.midiData?.title || "unknown_song",
        songName: storeState.midiData?.title || "Unknown Song",
        songThumbnail: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=200&h=200", // placeholder
        songDifficulty: storeState.analysis?.difficulty || "Medium",
        accuracy: parseInt(calculateAccuracy()),
        grade: calculateGrade(),
        perfect: storeState.performanceStats.perfect,
        good: storeState.performanceStats.good,
        miss: storeState.performanceStats.miss,
        maxCombo: storeState.performanceStats.maxCombo,
        practiceMinutes: Math.max(1, Math.round(storeState.currentTime / 60)), // ensure at least 1 min
        mode: storeState.learningConfig.mode
      };

      saveSession(user.uid, sessionData, storeState.hitHistory)
        .then(() => console.log("Session saved to Firebase!"))
        .catch(err => console.error("Failed to save session:", err))
        .finally(() => setIsSaving(false));
    }
  }, [sessionComplete, user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMidiFile(file);
    setIsParsing(true);
    const parsed = await parseMidi(file);
    const analyzed = analyzeSong(parsed);
    const generatedLesson = generateLesson(parsed);

    setMidiData(parsed);
    setAnalysis(analyzed);
    setLesson(generatedLesson);

    // Phase 9: Detect Sections
    const generatedSections = calculateSections(generatedLesson.rightHandNotes); // simplistic fallback
    setSongSections(generatedSections);

    // Initialize Interactive Lesson with Step 1
    setLessonEngine(createInteractiveLesson(generatedLesson.rightHandNotes));
    setEngineUpdate((prev) => prev + 1);

    setIsParsing(false);
    console.log("Parsed:", parsed);
    console.log("Analyzed:", analyzed);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {!focusMode && <Navbar />}
      <div className="flex">
        {!focusMode && <Sidebar />}
        <main className={`flex-1 ${focusMode ? "p-0 h-screen overflow-hidden flex flex-col" : "p-8 space-y-8"}`}>
          {!focusMode && (
            <>
              <h1 className="text-4xl font-bold mb-8">Upload MIDI</h1>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
                <h2 className="text-2xl font-bold mb-4">Upload MIDI File</h2>
                <p className="text-zinc-400 mb-6">Drag & drop any MIDI file to generate analysis.</p>
                <input type="file" accept=".mid,.midi" onChange={handleUpload} />
              </div>
            </>
          )}

          {midiData && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold mb-6">MIDI Analysis</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Song Title</p>
                  <p className="font-semibold mt-1">{midiData.title}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Tempo</p>
                  <p className="font-semibold mt-1">{Math.round(midiData.tempo)} BPM</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Duration</p>
                  <p className="font-semibold mt-1">{Math.round(midiData.duration)}s</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Track Count</p>
                  <p className="font-semibold mt-1">{midiData.tracks}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Note Count</p>
                  <p className="font-semibold mt-1">{midiData.noteCount}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Time Signature</p>
                  <p className="font-semibold mt-1">{midiData.timeSignature.join('/')}</p>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold mb-6">Song Difficulty Analysis</h2>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Difficulty</p>
                  <p className="font-bold text-xl mt-1 text-orange-500">{analysis.difficulty}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Overall Score</p>
                  <p className="font-semibold text-lg mt-1">{analysis.difficultyScore} / 10</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Notes Per Second</p>
                  <p className="font-semibold text-lg mt-1">{analysis.notesPerSecond}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Tempo Penalty</p>
                  <p className="font-semibold text-lg mt-1">+{analysis.tempoScore}</p>
                </div>
              </div>
            </div>
          )}

          {midiData && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold mb-6">Playback Controls</h2>

              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    console.log("Playing MIDI");
                    useMidiStore.getState().resetPerformance();
                    nextScoringNoteIndexRef.current = 0;
                    currentStepRef.current = 0;
                    
                    await initializeAudio();
                    playMidi(midiData.notes);
                    setIsPlaying(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition"
                >
                  ▶ Play
                </button>

                <button
                  onClick={() => {
                    console.log("Paused MIDI");
                    pauseMidi();
                    setIsPlaying(false);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 border border-zinc-700 rounded-xl flex items-center gap-2 transition"
                >
                  ⏸ Pause
                </button>

                <button
                  onClick={() => {
                    console.log("Stopped MIDI");
                    stopMidi();
                    setIsPlaying(false);
                    setCurrentTime(0);
                    currentStepRef.current = 0;
                    setExpectedNotes([]);
                    setFeedbackState("idle");
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 border border-zinc-700 rounded-xl flex items-center gap-2 transition"
                >
                  ⏹ Stop
                </button>
              </div>
            </div>
          )}

          {midiData && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold mb-6">Playback Status</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Current Time</p>
                  <p className="font-semibold text-lg mt-1">{currentTime.toFixed(1)} sec</p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Playback State</p>
                  <p className="font-semibold text-lg mt-1">
                    {isPlaying ? "Playing" : currentTime > 0 ? "Paused" : "Stopped"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {lessonEngine && !focusMode && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Interactive Lesson</h2>
                <button 
                  onClick={() => setFocusMode(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-lg transition border border-zinc-700"
                >
                  🧘 Enter Focus Mode
                </button>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-6">
                <p className="text-zinc-400 text-sm mb-2">Current Lesson Step</p>
                <p className="font-semibold text-xl text-orange-500">Step 1: Right Hand Practice</p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <p className="font-semibold text-lg flex items-center gap-2">
                    🎹 Practice Input
                  </p>
                  <p className="text-zinc-400 text-sm mt-1">Select how you want to play along.</p>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="inputMode" 
                      value="mouse" 
                      checked={inputMode === "mouse"} 
                      onChange={() => setInputMode("mouse")}
                      className="accent-orange-500"
                    />
                    <span>Mouse</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="inputMode" 
                      value="computer" 
                      checked={inputMode === "computer"} 
                      onChange={() => setInputMode("computer")}
                      className="accent-orange-500"
                    />
                    <span>Computer Keyboard</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="inputMode" 
                      value="midi" 
                      checked={inputMode === "midi"} 
                      onChange={() => setInputMode("midi")}
                      className="accent-orange-500"
                    />
                    <span>MIDI Keyboard</span>
                  </label>
                </div>
              </div>

              {/* Phase 7: MIDI Device Status */}
              <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <p className="font-semibold text-lg flex items-center gap-2">
                    🎹 Hardware Status
                  </p>
                  <p className="text-zinc-400 text-sm mt-1">Connect your digital piano or synthesizer.</p>
                </div>
                
                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">Device</p>
                    <p className={`font-bold ${activeMidiDevice ? "text-green-400" : "text-red-400"}`}>
                      {activeMidiDevice ? activeMidiDevice.name : "❌ No Device Found"}
                    </p>
                  </div>
                  {activeMidiDevice && (
                    <div className="text-right border-l border-zinc-800 pl-8">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Latency</p>
                      <p className="font-bold text-orange-500">{midiLatency}ms</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Phase 4: Learning Mode Selector */}
              <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div>
                  <p className="font-semibold text-lg flex items-center gap-2">
                    🧠 Learning Mode
                  </p>
                  <p className="text-zinc-400 text-sm mt-1">Change how the lesson engine reacts.</p>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="learningMode" 
                      value="performance" 
                      checked={learningConfig.mode === "performance"} 
                      onChange={() => setLearningConfig({ mode: "performance" })}
                      className="accent-orange-500"
                    />
                    <span>Performance</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="learningMode" 
                      value="wait" 
                      checked={learningConfig.mode === "wait"} 
                      onChange={() => setLearningConfig({ mode: "wait" })}
                      className="accent-orange-500"
                    />
                    <span>Wait Mode</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="learningMode" 
                      value="practice" 
                      checked={learningConfig.mode === "practice"} 
                      onChange={() => setLearningConfig({ mode: "practice" })}
                      className="accent-orange-500"
                    />
                    <span>Practice Mode</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <TempoControls />
                <HandSelector />
                <LoopControls />
              </div>

              {/* Wait Mode Expected Notes Feedback */}
              {learningConfig.mode === "wait" && expectedNotes.length > 0 && (
                <div className="flex items-center justify-center mb-6">
                  <div className={`px-8 py-4 rounded-full text-2xl font-bold flex items-center gap-4 shadow-lg transition-all ${
                    feedbackState === "perfect" ? "bg-green-500/20 text-green-500 border border-green-500/50" :
                    feedbackState === "incorrect" ? "bg-red-500/20 text-red-500 border border-red-500/50" :
                    "bg-zinc-800 text-orange-400 border border-orange-500/30"
                  }`}>
                    {feedbackState === "perfect" ? "🟢 Perfect!" : 
                     feedbackState === "incorrect" ? "🔴 Try Again!" : 
                     `🎯 Play: ${expectedNotes.join(" + ")}`}
                  </div>
                </div>
              )}

              {/* Phase 5 Live HUD */}
              <div className="bg-black border border-zinc-800 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div className="text-center">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider">
                    {learningConfig.mode === "wait" ? "First-Try Accuracy" : "Accuracy"}
                  </p>
                  <p className="font-bold text-2xl text-orange-500">{calculateAccuracy()}%</p>
                </div>
                
                {learningConfig.mode !== "wait" && (
                  <div className="text-center border-l border-r border-zinc-800 px-8">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">Combo</p>
                    <p className="font-bold text-2xl">x{performanceStats.combo}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-zinc-500 text-sm uppercase">Longest Combo</p>
                  <p className="font-bold text-2xl text-orange-500">x{performanceStats.maxCombo}</p>
                </div>
              </div>

              <SectionSelector />

              <div className="mb-6 mt-8">
                <PianoRoll 
                  rawNotes={filterNotesByHand(lesson, activeHand)} 
                  currentTime={currentTime} 
                />
              </div>
            </div>
          )}

          {focusMode && lessonEngine && (
            <div className="flex-1 flex flex-col bg-black">
              {/* Focus Mode Header */}
              <div className="p-4 flex justify-between items-center bg-zinc-900 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setFocusMode(false)}
                    className="text-zinc-400 hover:text-white transition font-semibold text-sm"
                  >
                    ← Exit Focus
                  </button>
                  <div className="flex gap-4 text-sm font-semibold">
                    <span className="text-orange-500">Accuracy: {calculateAccuracy()}%</span>
                    <span className="text-zinc-400 border-l border-zinc-800 pl-4">Combo: x{performanceStats.combo}</span>
                    <span className="text-zinc-400 border-l border-zinc-800 pl-4">{(currentTime).toFixed(1)}s</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => { pauseMidi(); setIsPlaying(false); }} className="bg-zinc-800 px-4 py-1 rounded text-sm font-bold">⏸</button>
                  <button onClick={async () => { await initializeAudio(); playMidi(midiData.notes); setIsPlaying(true); }} className="bg-orange-500 text-black px-4 py-1 rounded text-sm font-bold">▶ Play</button>
                </div>
              </div>

              {/* Floating Tools Row */}
              <div className="px-8 py-4 flex gap-4 shrink-0 bg-black z-10">
                <div className="flex-1"><SectionSelector /></div>
                <div className="w-96"><LoopControls /></div>
              </div>

              {/* Expanded Piano Roll Area */}
              <div className="flex-1 relative min-h-0 bg-black mt-2">
                <PianoRoll 
                  rawNotes={filterNotesByHand(lesson, activeHand)} 
                  currentTime={currentTime} 
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* End Session Modal */}
      {sessionComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <h2 className="text-3xl font-bold text-center mb-2">🎉 Song Complete</h2>
            <p className="text-center text-zinc-400 mb-8">Here is how you performed!</p>
            
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Final Grade</p>
                <div className="text-7xl font-black text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                  {calculateGrade()}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8 bg-black p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-zinc-400">
                  {learningConfig.mode === "wait" ? "First-Try Accuracy" : "Accuracy"}
                </span>
                <span className="font-bold text-xl">{calculateAccuracy()}%</span>
              </div>
              
              {learningConfig.mode === "wait" ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">First-Try Correct</span>
                    <span className="font-semibold text-green-400">{performanceStats.firstTryCorrect}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Total Prompts</span>
                    <span className="font-semibold">{performanceStats.totalPrompts}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Perfect</span>
                    <span className="font-semibold text-green-400">{performanceStats.perfect}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Good</span>
                    <span className="font-semibold text-yellow-400">{performanceStats.good}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Miss</span>
                    <span className="font-semibold text-red-400">{performanceStats.miss}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                    <span className="text-zinc-400">Longest Combo</span>
                    <span className="font-bold text-orange-500">x{performanceStats.maxCombo}</span>
                  </div>
                </>
              )}
            </div>

            {/* Embed AI Coach Report inside Modal */}
            {coachHistory.length > 0 && <CoachCard report={coachHistory[0]} />}

            <button
              onClick={() => setSessionComplete(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 px-8 rounded-xl transition shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
