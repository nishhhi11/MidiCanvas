import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { parseMidi } from "../utils/midiParser";
import { exportToMidi, generateMidiBinary } from "../utils/fileExporter";
import { getTrackColor } from "../utils/colors";
import { usePlaybackController } from "../hooks/usePlayback";
import { useKeyboardPiano } from "../hooks/useKeyboardPiano";
import StudioPianoRoll from "../components/editor/PianoRollCanvas";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

import { useMidiStore } from "../stores/midiStore";
import { useMixerStore } from "../stores/useMixerStore";
import { usePlaybackStore } from "../stores/playbackStore";
import { useLibraryStore } from "../stores/libraryStore";
import { triggerCustomAttackRelease, getAudioContextTime } from "../utils/audioEngine";

export default function EditorPage() {

  const { handlePlay, handlePause, handleStop, handleSeek } = usePlaybackController();
  const { setMidiData, setUploadedFile, uploadedFile, midiData, isParsing, setIsParsing, updateMidiMetadata } = useMidiStore();
  const { clearMixer, masterVolume, setMasterVolume, soloedTracks, mutedTracks, trackVolumes, toggleMute, toggleSolo, setTrackVolume, trackColors } = useMixerStore();
  const { playbackState, isLooping, toggleLoop, playbackRate, setPlaybackRate, currentTime, loopStart, loopEnd, setLoopPoints } = usePlaybackStore();
  const { activeNotes: playbackActiveNotes } = usePlaybackStore();
  const { activeNotes: keyboardActiveNotes } = useKeyboardPiano();
  const { saveFile } = useLibraryStore();

  const [snap, setSnap] = useState('1/16');
  const [highlightKeys, setHighlightKeys] = useState(true);
  const [showNoteNames, setShowNoteNames] = useState(true);

  const [activePlayKeys, setActivePlayKeys] = useState(new Set());

  const [isRecording, setIsRecording] = useState(false);
  const recordingStartTime = useRef(0);
  const recordedNotes = useRef([]);
  const activeRecordingNotes = useRef(new Map());

  const noteToMidi = (note) => {
     const notesArr = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
     const octave = parseInt(note.slice(-1));
     const name = note.slice(0, -1);
     return octave * 12 + notesArr.indexOf(name) + 12; 
  };

  const toggleRecord = async () => {
     if (isRecording) {
         setIsRecording(false);

         activeRecordingNotes.current.forEach((startTime, note) => {
             const duration = (performance.now() - startTime) / 1000;
             const relativeStart = (startTime - recordingStartTime.current) / 1000;
             recordedNotes.current.push({
                 id: `rec-${recordedNotes.current.length}`,
                 name: note,
                 midi: noteToMidi(note),
                 time: relativeStart,
                 duration: duration,
                 velocity: 0.8,
                 track: 0
             });
         });
         activeRecordingNotes.current.clear();

         if (recordedNotes.current.length > 0) {
             const lastNote = recordedNotes.current[recordedNotes.current.length - 1];
             const trackDuration = lastNote.time + lastNote.duration + 1;

             const newMidiData = {
                 name: `Recording ${new Date().toLocaleString()}`,
                 tempo: 120,
                 trackCount: 1,
                 noteCount: recordedNotes.current.length,
                 duration: trackDuration,
                 timeSignature: "4/4",
                 notes: [...recordedNotes.current],
                 tracks: [{ id: 0, name: "Recorded Track", noteCount: recordedNotes.current.length }]
             };

             const binary = generateMidiBinary(newMidiData);
             if (binary) {
                 await saveFile(newMidiData, binary);
                 setMidiData(newMidiData);
             }
         }
     } else {
         recordedNotes.current = [];
         activeRecordingNotes.current.clear();
         recordingStartTime.current = performance.now();
         setIsRecording(true);
     }
  };

  const KEY_MAP = {
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3', 'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
    ',': 'C4', 'l': 'C#4', '.': 'D4', ';': 'D#4', '/': 'E4', 'q': 'F4', '2': 'F#4', 'w': 'G4', '3': 'G#4', 'e': 'A4', '4': 'A#4', 'r': 'B4', 't': 'C5'
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.repeat) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const note = KEY_MAP[e.key.toLowerCase()];
      if (note) {
        if (e.type === 'keydown') {
           if (!activePlayKeys.has(note)) {
               setActivePlayKeys(prev => new Set(prev).add(note));
               triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
               if (isRecording) {
                   activeRecordingNotes.current.set(note, performance.now());
               }
           }
        } else if (e.type === 'keyup') {
           setActivePlayKeys(prev => {
             const next = new Set(prev);
             next.delete(note);
             return next;
           });
           if (isRecording && activeRecordingNotes.current.has(note)) {
               const startTime = activeRecordingNotes.current.get(note);
               const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
               const relativeStart = (startTime - recordingStartTime.current) / 1000;
               recordedNotes.current.push({
                   id: `rec-${recordedNotes.current.length}`,
                   name: note,
                   midi: noteToMidi(note),
                   time: relativeStart,
                   duration: duration,
                   velocity: 0.8,
                   track: 0
               });
               activeRecordingNotes.current.delete(note);
           }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    }
  }, [isRecording]);

    const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file.name);
    try {
      setIsParsing(true);
      await new Promise(resolve => setTimeout(resolve, 50));
      const parsed = await parseMidi(file);
      setMidiData(parsed);
      clearMixer();
      usePlaybackStore.getState().setLoopPoints(0, parsed.duration);
      handleStop();

      const arrayBuffer = await file.arrayBuffer();
      const rawData = new Uint8Array(arrayBuffer);
      await saveFile(
        { name: file.name, duration: parsed.duration, trackCount: parsed.tracks.length, noteCount: parsed.notes ? parsed.notes.length : 0 },
        rawData
      );
    } catch (err) {
      console.error(err);
      alert("Failed to parse MIDI file. If the local server disconnected, please refresh the page and try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.mid')) {
      const syntheticEvent = { target: { files: [file] } };
      await handleFileUpload(syntheticEvent);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (usePlaybackStore.getState().playbackState === 'playing') handlePause();
        else handlePlay();
        return;
      }
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) useMidiStore.getState().redo();
        else useMidiStore.getState().undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlay, handlePause]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const virtualPianoKeys = [
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5'
  ];

  const hasMIDILoaded = !!uploadedFile;
  const isPlaying = playbackState === 'playing';
  const tempo = midiData?.tempo || 120;
  const totalTime = midiData?.duration || 0;

  const mergedActiveNotes = [...playbackActiveNotes, ...keyboardActiveNotes];
  const filteredNotes = midiData?.notes?.filter(n => {
    if (soloedTracks.size > 0) return soloedTracks.has(n.track);
    return !mutedTracks.has(n.track);
  }) || [];

  const totalNotesCount = midiData?.notes?.length || 0;
  const activeVoicesCount = mergedActiveNotes.length;

  return (
    <div 
      className="h-screen flex flex-col bg-black text-[#FFFFF0] overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >

      <header className="flex-shrink-0 border-b border-[#2a2a2a] bg-black/90 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#FFFFF0]">
              🎹 MIDI CANVAS
            </h1>
            <div className="h-5 w-px bg-[#2a2a2a]" />
            <div className="flex gap-1">
              {['EDITOR', 'LIBRARY', 'BROWSER'].map(tab => (
                <Link 
                  key={tab} 
                  to={tab === 'EDITOR' ? '/studio' : tab === 'LIBRARY' ? '/library' : '/'}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-all ${
                    tab === 'EDITOR' 
                      ? 'bg-[#2a2a2a] text-[#FFFFF0]' 
                      : 'text-[#888888] hover:text-[#FFFFF0] hover:bg-[#1a1a1a]'
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base text-[#888888] bg-[#1a1a1a] px-2 py-2 rounded">
              📁 {uploadedFile || 'No file loaded'}
            </span>
            <button 
              onClick={async () => {
                if (!midiData) return;
                try {
                  const { Midi } = await import('@tonejs/midi');
                  const newMidi = new Midi();
                  if (midiData.tempo) newMidi.header.setTempo(midiData.tempo);
                  const trackMap = {};
                  midiData.notes.forEach(note => {
                    if (!trackMap[note.track]) trackMap[note.track] = newMidi.addTrack();
                    trackMap[note.track].addNote({ midi: note.midi, time: note.time, duration: note.duration, velocity: note.velocity });
                  });
                  const rawData = newMidi.toArray();
                  await saveFile({ name: uploadedFile || 'Untitled', duration: midiData.duration || 0, trackCount: Object.keys(trackMap).length, noteCount: midiData.notes.length }, rawData);
                  alert("Saved to Library!");
                } catch (err) { console.error("Failed to save", err); }
              }}
              className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-md text-base transition-all text-[#FFFFF0]"
            >
              💾 SAVE
            </button>
            <button 
              onClick={() => exportToMidi(midiData)}
              className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-md text-base transition-all text-[#FFFFF0]"
            >
              📤 EXPORT
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 p-4 gap-4">

        <div className="w-72 flex-shrink-0 bg-black rounded-xl border border-[#2a2a2a] p-3 flex flex-col">
          <div className="text-base font-semibold text-[#888888] mb-2 uppercase tracking-wide">Transport</div>

          <div className="flex justify-center gap-2 mb-2">
            <button 
              onClick={toggleRecord}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-600 text-white shadow-[0_0_15px_#dc2626] animate-pulse' 
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#FFFFF0]'
              }`}
              title="Record"
            >
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
            </button>
            <button 
              onClick={() => handleSeek(0)}
              className="w-10 h-10 rounded-full text-base bg-[#1a1a1a] hover:bg-[#2a2a2a] text-base text-[#FFFFF0]"
              title="Rewind to Start"
            >
              ⏪
            </button>
            <button 
              onClick={() => isPlaying ? handlePause() : handlePlay()}
              className="w-12 h-12 rounded-full text-xl bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-base text-[#FFFFF0]"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button 
              onClick={() => handleStop()}
              className="w-10 h-10 rounded-full text-base bg-[#1a1a1a] hover:bg-[#2a2a2a] text-base text-[#FFFFF0]"
            >
              ⏹️
            </button>
            <button 
              onClick={() => handleSeek(Math.min(totalTime, currentTime + 5))}
              className="w-10 h-10 rounded-full text-base bg-[#1a1a1a] hover:bg-[#2a2a2a] text-base text-[#FFFFF0]"
              title="Fast Forward"
            >
              ⏩
            </button>
          </div>

          <button 
            onClick={toggleLoop}
            className={`text-base py-2 rounded-md mb-2 transition-all ${
              isLooping 
                ? 'bg-[#2a2a2a] text-[#D4C5A9] border border-[#D4C5A9]/30' 
                : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#2a2a2a]'
            }`}
          >
            🔁 {isLooping ? 'LOOP ACTIVE' : 'LOOP'}
          </button>

          <div className="text-center font-mono text-2xl font-bold text-[#D4C5A9] mb-2">
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-base text-[#888888] mb-1 flex justify-between">
                <span>🎯 TEMPO</span>
                <span className="text-[#D4C5A9]">{tempo} BPM</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => updateMidiMetadata({ tempo: Math.max(40, tempo - 5) })} 
                  className="w-7 h-7 rounded text-xs bg-[#1a1a1a] text-[#FFFFF0] text-base hover:bg-[#2a2a2a]"
                >
                  −
                </button>
                <input 
                  type="range" 
                  min="40" 
                  max="240" 
                  value={tempo} 
                  onChange={(e) => updateMidiMetadata({ tempo: parseInt(e.target.value) })} 
                  className="flex-1 h-1 bg-[#2a2a2a] rounded-lg accent-[#D4C5A9]" 
                />
                <button 
                  onClick={() => updateMidiMetadata({ tempo: Math.min(240, tempo + 5) })} 
                  className="w-7 h-7 rounded text-xs bg-[#1a1a1a] text-[#FFFFF0] text-base hover:bg-[#2a2a2a]"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <div className="text-base text-[#888888] mb-1 flex justify-between">
                <span>🔊 VOLUME</span>
                <span className="text-[#D4C5A9]">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={masterVolume} 
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))} 
                className="w-full h-1 bg-[#2a2a2a] rounded-lg accent-[#D4C5A9]" 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black rounded-xl border border-[#2a2a2a] p-3 flex flex-col min-w-0 relative">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
            <div className="text-base font-semibold text-[#888888] uppercase tracking-wide">
              🎼 Piano Roll Editor
            </div>
            <div className="flex gap-2">
              <select 
                value={snap} 
                onChange={(e) => setSnap(e.target.value)} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2 py-2.5 text-base text-[#FFFFF0]"
              >
                <option>1/4</option>
                <option>1/8</option>
                <option>1/16</option>
                <option>Triplet</option>
              </select>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept=".mid,.midi" 
                  onChange={handleFileUpload} 
                  ref={fileInputRef}
                  className="hidden" 
                />
                <span className="text-base bg-[#1a1a1a] px-2 py-2.5 rounded-md text-[#888888] hover:text-[#FFFFF0] cursor-pointer">
                  + Replace MIDI
                </span>
              </label>
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-0 bg-black rounded-lg relative">
            {!hasMIDILoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-xl z-10">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎹</div>
                  <div className="text-base text-[#888888] mb-2">Ready to create?</div>
                  <div className="text-base text-[#555555] mb-3">Drag and drop a .mid file anywhere</div>
                  <label className="cursor-pointer">
                    <input type="file" accept=".mid,.midi" onChange={handleFileUpload} className="hidden" />
                    <span className="px-4 py-2.5 bg-[#1a1a1a] rounded-md text-base hover:bg-[#2a2a2a] text-[#FFFFF0] cursor-pointer">
                      Select MIDI File
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <ErrorBoundary fallback={<div className="text-[#888888] p-4">Error loading piano roll.</div>}>
                <StudioPianoRoll 
                  rawNotes={filteredNotes}
                  duration={totalTime}
                  onSeek={handleSeek}
                  tempo={tempo}
                  timeSignature={midiData?.timeSignature}
                  trackColors={trackColors}
                />
              </ErrorBoundary>
            )}
            {isParsing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 rounded-xl">
                 <div className="w-8 h-8 border-2 border-gray-500/20 border-t-gray-400 rounded-full animate-spin mb-2" />
                 <span className="text-[#888888] text-base">Parsing MIDI...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-[#2a2a2a] bg-black p-4 w-full flex justify-center">
        <div className="w-full max-w-6xl relative h-32 select-none">

          <div className="flex w-full h-full">
            {virtualPianoKeys.filter(k => ![1, 3, 6, 8, 10].includes(virtualPianoKeys.indexOf(k) % 12)).map((note, idx) => {
              const isActive = activePlayKeys.has(note);
              const mappedKey = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note)?.toUpperCase() || '';
              return (
                <div 
                  key={note}
                  onPointerDown={() => {
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                    if (isRecording) activeRecordingNotes.current.set(note, performance.now());
                  }}
                  onPointerUp={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}
                  onPointerLeave={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}
                  className={`flex-1 border-x border-[#222] rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer transition-colors ${
                    isActive ? 'bg-[#D4C5A9] text-black shadow-[0_0_15px_#D4C5A9]' : 'bg-[#FFFFF0] text-gray-500 hover:bg-[#e0e0e0]'
                  }`}
                  style={{ zIndex: 1 }}
                >
                  {showNoteNames && <span className="text-xs font-bold pointer-events-none mb-1">{note}</span>}
                  {highlightKeys && <span className="text-[9px] font-mono pointer-events-none opacity-50 bg-black/10 px-1 rounded">{mappedKey}</span>}
                </div>
              );
            })}
          </div>

          <div className="absolute top-0 left-0 w-full h-2/3 pointer-events-none">
            {virtualPianoKeys.map((note, globalIdx) => {
              const isBlackKey = note.includes('#');
              if (!isBlackKey) return null;

              const whiteKeyIdx = virtualPianoKeys.slice(0, globalIdx).filter(k => !k.includes('#')).length;
              const totalWhiteKeys = 15; 
              const leftPercent = (whiteKeyIdx / totalWhiteKeys) * 100;
              const widthPercent = (1 / totalWhiteKeys) * 60; 

              const isActive = activePlayKeys.has(note);
              const mappedKey = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note)?.toUpperCase() || '';

              return (
                <div 
                  key={note}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                    if (isRecording) activeRecordingNotes.current.set(note, performance.now());
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}
                  onPointerLeave={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}
                  className={`absolute rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer pointer-events-auto transition-colors ${
                    isActive ? 'bg-[#D4C5A9] text-black shadow-[0_0_15px_#D4C5A9]' : 'bg-[#1a1a1a] border border-[#333] border-t-0 text-gray-400 hover:bg-[#2a2a2a]'
                  }`}
                  style={{ 
                    left: `calc(${leftPercent}% - ${widthPercent / 2}%)`, 
                    width: `${widthPercent}%`, 
                    height: '100%', 
                    zIndex: 10 
                  }}
                >
                  {showNoteNames && <span className="text-[10px] font-bold pointer-events-none mb-1">{note.replace('#', '♯')}</span>}
                  {highlightKeys && <span className="text-[8px] font-mono pointer-events-none opacity-50 bg-white/10 px-1 rounded">{mappedKey}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-[#2a2a2a] bg-black/50 p-3">
        <div className="grid grid-cols-4 gap-3">

          <div className="bg-black rounded-lg border border-[#2a2a2a] p-2">
            <div className="text-base font-semibold text-[#888888] mb-1.5 uppercase tracking-wide">
              🎚️ Mixer
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
              {!hasMIDILoaded ? (
                 <div className="text-base text-[#555555] italic">No tracks loaded</div>
              ) : (
                 midiData?.tracks?.map((track, idx) => {
                   const color = trackColors[track.id] || getTrackColor(track.id);
                   const isMuted = mutedTracks.has(track.id);
                   const isSoloed = soloedTracks.has(track.id);
                   return (
                    <div key={track.id || idx} className="flex flex-col mb-2">
                      <div className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-1">

                          <div className="relative w-3 h-3 rounded-full overflow-hidden shrink-0 cursor-pointer shadow-[0_0_5px_rgba(0,0,0,0.5)] border border-white/20 hover:scale-110 transition-transform">
                            <input 
                              type="color" 
                              value={color} 
                              onChange={(e) => setTrackColor(track.id, e.target.value)}
                              className="absolute -inset-2 w-8 h-8 cursor-pointer"
                            />
                          </div>

                          <span className="text-[#FFFFF0] truncate max-w-[60px]">{track.name || `Track ${track.id + 1}`}</span>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => toggleMute(track.id)}
                            className={`w-7 h-7 rounded text-xs text-base ${isMuted ? 'bg-red-900/50 text-red-400' : 'bg-[#1a1a1a] text-[#888888] hover:text-[#FFFFF0]'}`}
                          >
                            M
                          </button>
                          <button 
                            onClick={() => toggleSolo(track.id)}
                            className={`w-7 h-7 rounded text-xs text-base ${isSoloed ? 'bg-yellow-900/50 text-yellow-400' : 'bg-[#1a1a1a] text-[#888888] hover:text-[#FFFFF0]'}`}
                          >
                            S
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[9px] text-[#888888] w-6">VOL</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={trackVolumes[track.id] !== undefined ? trackVolumes[track.id] : 1.0} 
                          onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))} 
                          className="flex-1 h-0.5 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#D4C5A9]"
                        />
                      </div>
                    </div>
                   )
                 })
              )}
            </div>
            <div className="border-t border-[#2a2a2a] pt-1 mt-1">
              <div className="flex justify-between text-base">
                <span className="text-[#888888]">MASTER</span>
                <span className="text-[#D4C5A9]">{Math.round(masterVolume * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg border border-[#2a2a2a] p-2">
            <div className="text-base font-semibold text-[#888888] mb-1.5 uppercase tracking-wide">
              🎯 Learning Mode
            </div>
            <div className="space-y-1.5">
              <div>
                <div className="text-base text-[#888888] mb-0.5">Speed</div>
                <div className="flex gap-1">
                  {[0.5, 0.75, 1.0, 1.25].map(speed => (
                    <button 
                      key={speed} 
                      onClick={() => setPlaybackRate(speed)} 
                      className={`flex-1 py-2.5 rounded text-base transition-all ${
                        playbackRate === speed 
                          ? 'bg-[#2a2a2a] text-[#D4C5A9]' 
                          : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      {speed * 100}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setLoopPoints(currentTime, loopEnd)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟳ Set Start
                </button>
                <button 
                  onClick={() => setLoopPoints(loopStart, currentTime)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟲ Set End
                </button>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 text-base text-[#FFFFF0] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={highlightKeys} 
                    onChange={(e) => setHighlightKeys(e.target.checked)} 
                    className="w-3 h-3 accent-[#D4C5A9]" 
                  />
                  Keys
                </label>
                <label className="flex items-center gap-1 text-base text-[#FFFFF0] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showNoteNames} 
                    onChange={(e) => setShowNoteNames(e.target.checked)} 
                    className="w-3 h-3 accent-[#D4C5A9]" 
                  />
                  Notes
                </label>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg border border-[#2a2a2a] p-2">
            <div className="text-base font-semibold text-[#888888] mb-1.5 uppercase tracking-wide">
              📊 Status
            </div>
            <div className="grid grid-cols-2 gap-1 text-center">
              <div className="bg-[#1a1a1a] rounded p-1">
                <div className="text-xl lg:text-2xl font-bold text-[#D4C5A9]">{totalNotesCount}</div>
                <div className="text-[9px] lg:text-[11px] text-[#888888]">NOTES</div>
              </div>
              <div className="bg-[#1a1a1a] rounded p-1">
                <div className="text-xl lg:text-2xl font-bold text-[#D4C5A9]">{activeVoicesCount}</div>
                <div className="text-[9px] lg:text-[11px] text-[#888888]">VOICES</div>
              </div>
            </div>
            {isLooping && (
              <div className="text-[11px] text-[#D4C5A9] text-center mt-1">
                Loop: {loopStart?.toFixed(1) || 0}s to {loopEnd?.toFixed(1) || 0}s
              </div>
            )}
          </div>

          <div className="bg-black rounded-lg border border-[#2a2a2a] p-2">
            <div className="text-base font-semibold text-[#888888] mb-1.5 uppercase tracking-wide">
              ⌨️ Shortcuts
            </div>
            <div className="space-y-0.5 text-xs lg:text-sm">
              <div className="flex justify-between">
                <span className="text-[#FFFFF0]">Play/Pause</span>
                <span className="text-[#D4C5A9]">Space</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FFFFF0]">Delete Note</span>
                <span className="text-[#D4C5A9]">Delete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FFFFF0]">Undo</span>
                <span className="text-[#D4C5A9]">⌘Z</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};