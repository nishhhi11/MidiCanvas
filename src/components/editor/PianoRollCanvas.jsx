import { useShallow } from 'zustand/react/shallow';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Move, Grid3X3, ChevronsUpDown } from 'lucide-react';
import DraggableNote from "../editor/DraggableNote";
import VelocityLane from "./VelocityLane";
import Playhead from "./Playhead";
import { useMidiStore } from '../../stores/midiStore';
import { usePlaybackStore } from '../../stores/playbackStore';
import { triggerCustomAttackRelease, getAudioContextTime } from '../../utils/audioEngine';

import { getTrackColor } from '../../utils/colors';

/*
PURPOSE: Constants defining the dimensions and boundaries of the Piano Roll grid.
WHY IT EXISTS: 
START_MIDI 21 is A0 (lowest piano key). END_MIDI 108 is C8 (highest piano key).
Pre-calculating TOTAL_KEYS prevents running this math inside the render loop.
*/
const START_MIDI = 21; 
const END_MIDI = 108; 
const TOTAL_KEYS = END_MIDI - START_MIDI + 1;
const BASE_ROW_HEIGHT = 16; 

/*
PURPOSE:
The core visual component of the application. It renders the grid, the keyboard, the playhead, and orchestrates the notes.

REACT CONCEPT:
Complex Component with local state (zoom, selection) and global state (notes, playback).
*/
export default function StudioPianoRoll({ rawNotes = [], duration = 0, onSeek, tempo = 120, timeSignature = "4/4", trackColors = {} }) {
  // Local UI State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [verticalZoomLevel, setVerticalZoomLevel] = useState(1);
  
  /*
  PURPOSE: Tracks which notes the user has clicked/Shift-clicked.
  WHY Set?: Sets provide O(1) lookup time when checking if a note is selected during rendering, much faster than array `.includes()`.
  */
  const [selectedNoteIds, setSelectedNoteIds] = useState(new Set());
  const [snapDivision, setSnapDivision] = useState(0); 
  const [dragLoopState, setDragLoopState] = useState(null); 
  const [ghostTime, setGhostTime] = useState(null); 
  const [showVelocity, setShowVelocity] = useState(false);
  const [activeKeys, setActiveKeys] = useState(new Set()); 

  /*
  PURPOSE: Fetches the currently playing notes from the global store.
  VIVA QUESTION: Why use `useShallow` for store selectors?
  VIVA ANSWER: By default, Zustand uses strict equality (===). If a store returns an array or object, it will always be a *new* reference, causing the component to re-render constantly. `useShallow` does a shallow comparison, preventing re-renders if the contents of the array haven't actually changed.
  */
  const activePlaybackNotes = usePlaybackStore(state => state.activeNotes); 
  const activeNoteIds = new Set(activePlaybackNotes.map(n => n.id));
  const activeNoteMidis = new Set([...activePlaybackNotes.map(n => n.midi), ...activeKeys]);

  const [pointerTime, setPointerTime] = useState(0); 
  const [isHovering, setIsHovering] = useState(false);
  
  /*
  PURPOSE: References to DOM elements to manually synchronize their scroll positions.
  */
  const containerRef = useRef(null);
  const keyboardRef = useRef(null);
  const velocityRef = useRef(null);

  const { updateNote, deleteNote, addNote } = useMidiStore(useShallow(state => ({ updateNote: state.updateNote, deleteNote: state.deleteNote, addNote: state.addNote })));
  const { loopStart, loopEnd, setLoopPoints, isLooping } = usePlaybackStore(useShallow(state => ({ loopStart: state.loopStart, loopEnd: state.loopEnd, setLoopPoints: state.setLoopPoints, isLooping: state.isLooping })));

  /*
  PURPOSE: Dynamic layout calculations based on zoom state.
  PERFORMANCE: Computed during render. Time complexity O(1).
  */
  const ROW_HEIGHT = BASE_ROW_HEIGHT * verticalZoomLevel;
  const pixelsPerSecond = 100 * zoomLevel;
  const totalWidth = duration * pixelsPerSecond + 1000; 
  const totalHeight = TOTAL_KEYS * ROW_HEIGHT;

  /*
  PURPOSE: Global keyboard shortcut listener for Delete/Backspace and Select All (Ctrl+A).
  */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNoteIds.size > 0) {
        selectedNoteIds.forEach(id => deleteNote(id));
        setSelectedNoteIds(new Set());
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedNoteIds(new Set(rawNotes.map(n => n.id)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteIds, deleteNote, rawNotes]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 0.5));
  const handleVerticalZoomIn = () => setVerticalZoomLevel((z) => Math.min(z + 0.25, 2));
  const handleVerticalZoomOut = () => setVerticalZoomLevel((z) => Math.max(z - 0.25, 0.5));

  /*
  PURPOSE: Handles clicking on empty canvas space to seek the playhead.
  */
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('bg-[#1a1a1a]') || e.target.classList.contains('bg-[#111111]')) {
      setSelectedNoteIds(new Set());
    }

    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / pixelsPerSecond;
    onSeek(Math.max(0, Math.min(time, duration)));
  };

  /*
  PURPOSE: Handles double clicking the canvas to create a new note.
  ALGORITHM:
  1. Calculate X position -> Time in seconds (applying Snap-to-Grid if active).
  2. Calculate Y position -> MIDI note number (Inverting the Y-axis since low notes are at the bottom).
  3. Dispatch to Zustand.
  */
  const handleCanvasDoubleClick = (e) => {
    if (e.target !== e.currentTarget && !e.target.classList.contains('bg-[#1a1a1a]') && !e.target.classList.contains('bg-[#111111]')) {
      return;
    }
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    
    const noteAreaRect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - noteAreaRect.top;

    let time = x / pixelsPerSecond;
    
    if (snapDivision > 0) {
      const beatsPerMinute = tempo;
      const secondsPerBeat = 60 / beatsPerMinute;
      const secondsPerDivision = secondsPerBeat * (4 / snapDivision);
      time = Math.round(time / secondsPerDivision) * secondsPerDivision;
    }

    const midi = START_MIDI + (TOTAL_KEYS - 1 - Math.floor(y / ROW_HEIGHT));
    if (midi < START_MIDI || midi > END_MIDI) return;

    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteName = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;

    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      midi,
      time,
      duration: snapDivision > 0 ? (60 / tempo) * (4 / snapDivision) : 0.5,
      name: `${noteName}${octave}`,
      velocity: 0.8,
      track: 0
    };

    addNote(newNote);
  };

  // Loop Selection Handlers
  const handleLoopPointerDown = (e, type) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDragLoopState({
      type,
      pointerId: e.pointerId,
      startX: e.clientX,
      startVal: type === 'start' ? loopStart : loopEnd
    });
  };

  const handleLoopPointerMove = (e) => {
    if (!dragLoopState) return;
    const deltaX = e.clientX - dragLoopState.startX;
    let newTime = dragLoopState.startVal + (deltaX / pixelsPerSecond);
    newTime = Math.max(0, Math.min(newTime, duration));

    if (dragLoopState.type === 'start') {
      newTime = Math.min(newTime, loopEnd - 0.1);
      setLoopPoints(newTime, loopEnd);
    } else {
      newTime = Math.max(newTime, loopStart + 0.1);
      setLoopPoints(loopStart, newTime);
    }
  };

  const handleLoopPointerUp = (e) => {
    if (!dragLoopState) return;
    e.target.releasePointerCapture(dragLoopState.pointerId);
    setDragLoopState(null);
  };

  /*
  PURPOSE: Passed as a prop to `DraggableNote` so it can report when the user moves/resizes a note.
  REACT CONCEPT: Callback passing (Lifting state up).
  */
  const handleNoteUpdate = useCallback((id, updates) => {
    if (snapDivision > 0) {
      const beatsPerMinute = tempo;
      const secondsPerBeat = 60 / beatsPerMinute;
      const secondsPerDivision = secondsPerBeat * (4 / snapDivision); 

      if (updates.time !== undefined) {
        updates.time = Math.round(updates.time / secondsPerDivision) * secondsPerDivision;
        setGhostTime(updates.time); 
      }
      if (updates.duration !== undefined) {
        updates.duration = Math.round(updates.duration / secondsPerDivision) * secondsPerDivision;
        updates.duration = Math.max(secondsPerDivision, updates.duration);
        setGhostTime(updates.time !== undefined ? updates.time + updates.duration : null);
      }
    } else {
      if (updates.time !== undefined) setGhostTime(updates.time);
    }

    clearTimeout(window.ghostTimeout);
    window.ghostTimeout = setTimeout(() => setGhostTime(null), 100);

    updateNote(id, updates);
  }, [snapDivision, tempo, updateNote]);

  /*
  PURPOSE: Synchronizes the Y-scroll of the left keyboard to match the main canvas.
  VIVA QUESTION: How do you keep the keyboard and the grid aligned when scrolling?
  VIVA ANSWER: By attaching an `onScroll` listener to the main canvas container. Whenever it scrolls, we take its `scrollTop` value and programmatically apply it to the `keyboardRef` and `velocityRef` containers.
  */
  const handleScroll = (e) => {
    if (keyboardRef.current) {
      keyboardRef.current.scrollTop = e.target.scrollTop;
    }
    if (velocityRef.current) {
      velocityRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handlePointerMoveCanvas = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    const time = x / pixelsPerSecond;
    setPointerTime(time);

    window.dispatchEvent(new CustomEvent('piano-pointer-move', { detail: { time } }));
  };

  /*
  PURPOSE: Allows the user to preview a sound by clicking a key on the left keyboard UI.
  */
  const playVirtualKey = (midiNote) => {
    setActiveKeys(prev => new Set(prev).add(midiNote));
    triggerCustomAttackRelease(midiNote, 0.5, getAudioContextTime(), 0.8);
  };

  const stopVirtualKey = (midiNote) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(midiNote);
      return next;
    });
  };

  /*
  PURPOSE: Calculates the vertical grid lines based on tempo and time signature.
  TIME COMPLEXITY: O(D / B) where D is duration and B is secondsPerBeat.
  */
  const beatsPerMinute = tempo || 120;
  const beatsPerSecond = beatsPerMinute / 60;
  const secondsPerBeat = 1 / beatsPerSecond;
  const [beatsPerMeasure] = (timeSignature || "4/4").split("/").map(Number);
  const secondsPerMeasure = secondsPerBeat * beatsPerMeasure;

  const gridLines = [];
  for (let t = 0; t <= duration + 10; t += secondsPerBeat) {
    const isMeasure = Math.abs(t % secondsPerMeasure) < 0.01;
    gridLines.push({ time: t, isMeasure });
  }

  /*
  PURPOSE: Calculates the horizontal rows (the piano keys).
  */
  const rows = [];
  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  for (let i = 0; i < TOTAL_KEYS; i++) {
    const midi = START_MIDI + i;
    const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
    const noteName = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    const isC = noteName === "C";
    const top = (TOTAL_KEYS - 1 - i) * ROW_HEIGHT;
    rows.push({ midi, isBlack, top, label: isC ? `C${octave}` : "" });
  }

  return (
    <div className="flex flex-col w-full h-full relative group bg-[#161616]">
      {/* 
      PURPOSE: Toolbar Overlay for Zoom and Snap settings 
      */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2 bg-[#252526] shadow-lg p-1.5 rounded-lg border border-[#333] opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 mr-4 px-2">
          <Grid3X3 size={14} className="text-zinc-500" />
          <select 
            value={snapDivision}
            onChange={(e) => setSnapDivision(Number(e.target.value))}
            className="bg-transparent text-[10px] text-zinc-300 font-bold outline-none cursor-pointer"
          >
            <option value={0}>Snap: Off</option>
            <option value={4}>Snap: 1/4</option>
            <option value={8}>Snap: 1/8</option>
            <option value={16}>Snap: 1/16</option>
          </select>
        </div>
        <button onClick={() => setShowVelocity(!showVelocity)} className={`p-1.5 rounded-md transition-colors mr-2 ${showVelocity ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'}`} title="Toggle Velocity Lane">
          <ChevronsUpDown size={16} />
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
          <button onClick={handleVerticalZoomOut} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors" title="Zoom Out Vertical">
            <ZoomOut size={16} className="rotate-90" />
          </button>
          <span className="text-[10px] font-mono text-zinc-400 w-8 text-center">{Math.round(verticalZoomLevel * 100)}%</span>
          <button onClick={handleVerticalZoomIn} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors" title="Zoom In Vertical">
            <ZoomIn size={16} className="rotate-90" />
          </button>
        </div>
        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors" title="Zoom Out Horizontal">
          <ZoomOut size={16} />
        </button>
        <span className="text-[10px] font-mono text-zinc-400 flex items-center px-1 w-10 justify-center">{Math.round(zoomLevel * 100)}%</span>
        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors" title="Zoom In Horizontal">
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 
        PURPOSE: The Left Vertical Piano Keyboard Sidebar 
        */}
        <div 
          ref={keyboardRef}
          className="w-16 shrink-0 bg-[#1e1e1e] border-r border-[#333] z-10 overflow-hidden select-none"
        >
          <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
            {rows.map(row => (
              <div 
                key={`key-${row.midi}`}
                className={`absolute w-full border-b border-[#111] flex items-center justify-end px-1 cursor-pointer select-none transition-colors duration-75
                  ${row.isBlack 
                    ? (activeNoteMidis.has(row.midi) ? 'bg-white text-black' : 'bg-[#1a1a1a] text-zinc-600 hover:bg-[#2a2a2a]') 
                    : (activeNoteMidis.has(row.midi) ? 'bg-white text-black' : 'bg-[#e0e0e0] text-zinc-500 hover:bg-white')}`}
                style={{ top: row.top, height: ROW_HEIGHT }}
                onPointerDown={(e) => {
                  e.target.setPointerCapture(e.pointerId);
                  playVirtualKey(row.midi);
                }}
                onPointerUp={(e) => {
                  e.target.releasePointerCapture(e.pointerId);
                  stopVirtualKey(row.midi);
                }}
                onPointerCancel={(e) => {
                  stopVirtualKey(row.midi);
                }}
              >
                {row.label && <span className="text-[9px] font-bold pointer-events-none">{row.label}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 
        PURPOSE: The Main Scrolling Grid Area 
        */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto relative custom-scrollbar bg-[#1a1a1a]"
        >
          <div 
            className="relative"
            style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
            onPointerDown={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            onPointerMove={handlePointerMoveCanvas}
            onPointerEnter={() => setIsHovering(true)}
            onPointerLeave={() => setIsHovering(false)}
          >
            {/* Horizontal Rows */}
            {rows.map(row => (
              <div 
                key={`row-${row.midi}`}
                className={`absolute w-full border-b pointer-events-none ${row.isBlack ? 'bg-[#0a0a0a] border-[#222]' : 'bg-[#161616] border-[#282828]'}`}
                style={{ top: row.top, height: ROW_HEIGHT }}
              />
            ))}

            {/* Time Hover Pointer */}
            {isHovering && pointerTime > 0 && (
              <div 
                className="absolute top-0 bottom-0 pointer-events-none z-40 border-l border-dashed border-[#D4C5A9]/50"
                style={{ left: pointerTime * pixelsPerSecond }}
              >
                <div className="absolute top-2 left-1 bg-[#D4C5A9] text-black text-[10px] font-mono px-1.5 py-0.5 rounded-sm shadow-md whitespace-nowrap">
                  {Math.floor(pointerTime / 60)}:{(pointerTime % 60).toFixed(2).padStart(5, '0')}
                </div>
              </div>
            )}

            {/* Vertical Grid Lines */}
            {gridLines.map((line, i) => (
              <div 
                key={`grid-${i}`}
                className={`absolute top-0 h-full border-r pointer-events-none z-0`}
                style={{ 
                  left: line.time * pixelsPerSecond,
                  borderColor: line.isMeasure ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'
                }}
              >
                {line.isMeasure && <span className="absolute bottom-1 left-2 text-[10px] text-[#666] font-mono select-none z-10 bg-[#1a1a1a]/80 px-1 rounded">M{Math.round(line.time / secondsPerMeasure) + 1}</span>}
              </div>
            ))}

            {/* Loop Region Overlay */}
            {isLooping && loopEnd > 0 && (
              <div 
                className="absolute top-0 h-full bg-white/5 border-x border-white/30 z-20 pointer-events-none"
                style={{ left: loopStart * pixelsPerSecond, width: (loopEnd - loopStart) * pixelsPerSecond }}
              >
                <div className="absolute top-0 w-full h-4 bg-white/20 flex items-center justify-between pointer-events-auto">
                  <div className="w-4 h-full cursor-ew-resize hover:bg-white/50 touch-none flex items-center justify-center" onPointerDown={(e) => handleLoopPointerDown(e, 'start')} onPointerMove={handleLoopPointerMove} onPointerUp={handleLoopPointerUp} onPointerCancel={handleLoopPointerUp}>
                    <div className="w-[2px] h-2 bg-white/50" />
                  </div>
                  <div className="w-4 h-full cursor-ew-resize hover:bg-white/50 touch-none flex items-center justify-center" onPointerDown={(e) => handleLoopPointerDown(e, 'end')} onPointerMove={handleLoopPointerMove} onPointerUp={handleLoopPointerUp} onPointerCancel={handleLoopPointerUp}>
                    <div className="w-[2px] h-2 bg-white/50" />
                  </div>
                </div>
              </div>
            )}

            {/* 
            PURPOSE: Render all MIDI Notes
            VIVA QUESTION: Why `pointer-events-none` on the container but `pointer-events-auto` on the children?
            VIVA ANSWER: The container stretches over the entire grid. If it captured pointer events, we couldn't click the grid underneath to seek or double-click to add a note. We disable events for the container, but re-enable them specifically on the DraggableNote components so they can be clicked and dragged.
            */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {rawNotes.map((note) => {
                if (note.midi < START_MIDI || note.midi > END_MIDI) return null;
                const trackId = note.track || 0;
                const colorHex = trackColors?.[trackId] || getTrackColor(trackId);

                return (
                  <div key={note.id} className="pointer-events-auto">
                    <DraggableNote
                      note={note}
                      colorClass="text-zinc-900" 
                      colorHex={colorHex}
                      pixelsPerSecond={pixelsPerSecond}
                      ROW_HEIGHT={ROW_HEIGHT}
                      START_MIDI={START_MIDI}
                      END_MIDI={END_MIDI}
                      isSelected={selectedNoteIds.has(note.id)}
                      isPlaying={activeNoteIds.has(note.id)}
                      onSelect={(id, multi) => {
                        setSelectedNoteIds(prev => {
                          const next = new Set(multi ? prev : []);
                          if (next.has(id)) next.delete(id);
                          else next.add(id);
                          return next;
                        });
                      }}
                      onUpdate={handleNoteUpdate}
                      onDelete={deleteNote}
                    />
                  </div>
                );
              })}
            </div>

            {/* Ghosting for alignment visualizer */}
            {ghostTime !== null && (
              <div 
                className="absolute top-0 h-full w-[2px] bg-white shadow-[0_0_10px_#ffffff] z-30 pointer-events-none"
                style={{ left: ghostTime * pixelsPerSecond }}
              />
            )}

            <Playhead pixelsPerSecond={pixelsPerSecond} containerRef={containerRef} />
          </div>
        </div>
      </div>

      {/* Optional Velocity Bottom Pane */}
      {showVelocity && (
        <div className="flex w-full border-t border-[#333]">
          <div className="w-16 shrink-0 bg-[#1e1e1e] border-r border-[#333]" />
          <div className="flex-1 overflow-hidden" ref={velocityRef}>
            <div style={{ width: `${totalWidth}px` }}>
              <VelocityLane 
                rawNotes={rawNotes} 
                duration={duration} 
                pixelsPerSecond={pixelsPerSecond} 
                onNoteUpdate={handleNoteUpdate} 
                selectedNoteIds={selectedNoteIds}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
This is the core visual component of the Editor. It renders a 2D scrolling grid where the X-axis is time and the Y-axis is pitch (MIDI note numbers). It handles note rendering, dragging, resizing, zooming, and keyboard shortcuts.

Data Flow:
Receives `rawNotes` via props -> Maps them to `DraggableNote` components.
User drags note -> Calls `handleNoteUpdate` -> Calls `updateNote` in Zustand store -> Re-renders with new positions.

Important Variables:
- `zoomLevel`, `verticalZoomLevel`: Scales the X and Y axes mathematically.
- `snapDivision`: Determines if note movements snap to rhythmic grids (e.g. 1/4 or 1/8th notes).
- `selectedNoteIds`: A `Set` tracking highlighted notes for bulk operations (deletion).

Important Functions:
- `handleCanvasDoubleClick`: Calculates mouse coordinates to create a new note object and dispatch it to the store.
- `handleScroll`: Synchronizes the scrolling of the main grid with the vertical piano keyboard and the horizontal velocity lane.

React Concepts Used:
- `useState`, `useRef`, `useEffect`, `useCallback`.
- Lifting state up (passing callbacks to child `DraggableNote` components).
- DOM ref manipulation for synchronized scrolling.

JavaScript Concepts Used:
- Keyboard event listeners (`keydown`).
- `Set` operations for O(1) membership checking.
- Math operations for coordinate-to-time conversion.

Browser APIs Used:
- `getBoundingClientRect()` for precise mouse coordinate calculations within a scrolling container.
- `CustomEvent` for cross-component communication (pointer hover time).

Performance Considerations:
- **Set vs Array for lookups:** Checking `activeNoteIds.has(id)` is O(1). Doing this inside a map function over thousands of notes is significantly faster than using `.includes()` which is O(N).
- **Zustand `useShallow`:** Prevents the entire grid from re-rendering every time the audio engine updates the `currentTime`, because it only pulls specific setter functions from the store.

Most Likely Viva Questions:
1. Explain how the component converts a mouse click (X, Y) into a musical note (Time, Pitch).
2. Why do you use `useRef` for the containers and manually sync scrolling?
3. What is the time complexity of rendering notes?

Tricky Follow-Up Questions:
1. If the user zooms in while the playhead is playing, what happens to the UI?
2. What happens if there are 10,000 notes? Does React crash?

Expected Answers:
1. It uses `getBoundingClientRect()` to get the mouse position relative to the container. X is divided by `pixelsPerSecond` to get `time`. Y is divided by `ROW_HEIGHT` to get the vertical index, which is inverted and added to `START_MIDI` to determine the pitch.
2. React state updates are too slow for smooth scrolling. By using `onScroll` on the main container and imperatively setting `scrollTop` and `scrollLeft` on the child containers via `useRef`, the scrolling stays perfectly locked in sync visually without triggering React renders.
3. Rendering notes is O(N) where N is the number of notes in the `rawNotes` array.
4. *Follow-up 1:* The `pixelsPerSecond` variable increases. The `totalWidth` expands. Because the `Playhead` component calculates its `left` CSS property dynamically based on `pixelsPerSecond`, it instantly jumps to its new correct visual position without interrupting audio playback.
5. *Follow-up 2:* Rendering 10,000 DOM nodes in React can cause severe lag. While this component is optimized with Sets and Shallow selectors, a production-grade app would require "Windowing" (Virtualization) – only rendering the notes currently visible in the scroll viewport.
*/
