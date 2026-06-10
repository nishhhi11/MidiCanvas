import { useEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useMidiStore } from "../store/midiStore";
import { parseMidi } from "../services/midiParser";
import { analyzeSong } from "../services/songAnalyzer";
import { generateLesson } from "../services/lessonGenerator";
import { createInteractiveLesson } from "../services/interactiveLessonEngine";
import { initializeAudio, playMidi, pauseMidi, stopMidi, getCurrentTime } from "../services/playbackEngine";
import PianoKeyboard from "../components/piano/PianoKeyboard";

export default function Upload() {
  const {
    setMidiFile, midiData, setMidiData, setIsParsing,
    analysis, setAnalysis,
    lesson, setLesson,
    currentTime, setCurrentTime,
    isPlaying, setIsPlaying
  } = useMidiStore();

  const requestRef = useRef();
  const [lessonEngine, setLessonEngine] = useState(null);
  const [, setEngineUpdate] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      if (isPlaying) {
        setCurrentTime(getCurrentTime());
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

    // Initialize Interactive Lesson with Step 1 (Right Hand Notes)
    setLessonEngine(createInteractiveLesson(generatedLesson.rightHandNotes));
    setEngineUpdate((prev) => prev + 1);

    setIsParsing(false);
    console.log("Parsed:", parsed);
    console.log("Analyzed:", analyzed);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <h1 className="text-4xl font-bold mb-8">Upload MIDI</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-4">Upload MIDI File</h2>
            <p className="text-zinc-400 mb-6">Drag & drop any MIDI file to generate analysis.</p>
            <input type="file" accept=".mid,.midi" onChange={handleUpload} />
          </div>

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

          {lessonEngine && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold mb-6">Interactive Lesson</h2>

              <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-6">
                <p className="text-zinc-400 text-sm mb-2">Current Lesson Step</p>
                <p className="font-semibold text-xl text-orange-500">Step 1: Right Hand Practice</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Current Note</p>
                  <p className="font-bold text-3xl mt-2">{lessonEngine.getCurrentNote()?.name || "-"}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Next Note</p>
                  <p className="font-semibold text-xl mt-2 text-zinc-500">{lessonEngine.getNextNote()?.name || "-"}</p>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm">Progress</p>
                  <p className="font-semibold text-xl mt-2">
                    {lessonEngine.currentIndex} / {lessonEngine.totalNotes}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-zinc-400 text-sm mb-2">
                  Target Note: <span className="font-bold text-orange-500">{lessonEngine.getCurrentNote()?.name || "-"}</span>
                </p>
                <PianoKeyboard
                  currentNote={lessonEngine.getCurrentNote()}
                  nextNote={lessonEngine.getNextNote()}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    lessonEngine.advanceLesson();
                    setEngineUpdate(prev => prev + 1);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-xl transition"
                >
                  Advance Lesson
                </button>

                <button
                  onClick={() => {
                    lessonEngine.resetLesson();
                    setEngineUpdate(prev => prev + 1);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 border border-zinc-700 rounded-xl transition"
                >
                  Restart Lesson
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
