import { useState, useRef, useEffect, useCallback } from 'react';
import { useMidiStore } from '../stores/midiStore';
import { usePlaybackStore } from '../stores/playbackStore';
import { snapToGrid, snapDuration } from '../utils/quantization';

const START_MIDI = 21;
const END_MIDI = 108;
const TOTAL_KEYS = END_MIDI - START_MIDI + 1;
const ROW_HEIGHT = 16;

/*
PURPOSE:
Centralizes the logic needed to render and interact with the Piano Roll Canvas (Zooming, Keyboard Shortcuts, Snap-To-Grid Quantization, and Row Math).

REACT CONCEPT:
A Custom Hook abstracting away "UI Business Logic" from the presentational Canvas component.
*/
export function usePianoRoll({ tempo = 120, timeSignature = '4/4', duration = 0 }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snapDivision, setSnapDivision] = useState(0); // 0 = off, 4 = quarter, 8 = eighth
  const containerRef = useRef(null);
  
  const { updateNote, deleteNote } = useMidiStore();
  const { loopStart, loopEnd, setLoopPoints, isLooping } = usePlaybackStore();

  /*
  VIVA QUESTION:
  How does `pixelsPerSecond` relate to `zoomLevel`?

  VIVA ANSWER:
  It serves as the core mathematical multiplier for the entire X-axis of the application. At a zoom level of 1, 1 second of audio = 100 pixels wide. If zoom is 2, the multiplier is 200, so a 5-second MIDI clip goes from 500 pixels to 1000 pixels wide, physically expanding the scrollable width of the `totalWidth` canvas.
  */
  const pixelsPerSecond = 100 * zoomLevel;
  const totalWidth = Math.max(duration * pixelsPerSecond, 1000); // Minimum 1000px width
  const totalHeight = TOTAL_KEYS * ROW_HEIGHT;

  /*
  PURPOSE:
  Global keyboard shortcut listener for deleting the currently selected note.
  */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNoteId) {
        deleteNote(selectedNoteId);
        setSelectedNoteId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, deleteNote]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 0.5));

  /*
  PURPOSE:
  Intercepts note update events (from dragging/resizing) and applies Snap-To-Grid quantization math before sending the final values to the Zustand store.
  */
  const handleNoteUpdate = useCallback((id, updates) => {
    if (snapDivision > 0) {
      if (updates.time !== undefined) {
        updates.time = snapToGrid(updates.time, tempo, snapDivision);
      }
      if (updates.duration !== undefined) {
        updates.duration = snapDuration(updates.duration, tempo, snapDivision);
      }
    }
    updateNote(id, updates);
  }, [snapDivision, tempo, updateNote]);

  /*
  PURPOSE:
  Generates the background horizontal rows for the canvas grid.
  */
  const rows = [];
  for (let i = 0; i < TOTAL_KEYS; i++) {
    const midi = START_MIDI + i;
    const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
    const top = (TOTAL_KEYS - 1 - i) * ROW_HEIGHT; // Invert Y-axis so low notes are at the bottom
    rows.push({ midi, isBlack, top });
  }

  return {
    zoomLevel, setZoomLevel,
    selectedNoteId, setSelectedNoteId,
    snapDivision, setSnapDivision,
    containerRef,
    pixelsPerSecond, totalWidth, totalHeight,
    handleZoomIn, handleZoomOut,
    handleNoteUpdate,
    rows,
    loopStart, loopEnd, setLoopPoints, isLooping,
    ROW_HEIGHT, START_MIDI, END_MIDI, TOTAL_KEYS,
  };
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Provides UI math (`zoomLevel`, `pixelsPerSecond`), snapping/quantization logic, and keyboard shortcut event listeners for the main Piano Roll editor.

React Concepts Used:
- `useRef` for container scrolling.
- Global window event listeners via `useEffect`.

Most Likely Viva Questions:
1. Explain how the Y-axis inversion works for the `rows` array.

Expected Answers:
1. HTML Canvas and standard web DOM rendering use a Y-axis that starts at `0` at the *top* of the screen and grows downward. However, in musical notation and piano rolls, lower pitches are always at the *bottom*. By calculating `(TOTAL_KEYS - 1 - i) * ROW_HEIGHT`, we invert the rendering coordinate so that the lowest MIDI note (21) renders at the largest Y pixel value (the bottom).
*/
