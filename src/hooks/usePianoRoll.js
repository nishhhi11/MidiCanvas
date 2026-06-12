
import { useState, useRef, useEffect, useCallback } from 'react';
import { useMidiStore } from '../stores/midiStore';
import { usePlaybackStore } from '../stores/playbackStore';
import { snapToGrid, snapDuration } from '../utils/quantization';

const START_MIDI = 21;
const END_MIDI = 108;
const TOTAL_KEYS = END_MIDI - START_MIDI + 1;
const ROW_HEIGHT = 16;

export function usePianoRoll({ tempo = 120, timeSignature = '4/4', duration = 0 }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snapDivision, setSnapDivision] = useState(0);
  const containerRef = useRef(null);
  const { updateNote, deleteNote } = useMidiStore();
  const { loopStart, loopEnd, setLoopPoints, isLooping } = usePlaybackStore();

  const pixelsPerSecond = 100 * zoomLevel;
  const totalWidth = Math.max(duration * pixelsPerSecond, 1000);
  const totalHeight = TOTAL_KEYS * ROW_HEIGHT;

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

  const rows = [];
  for (let i = 0; i < TOTAL_KEYS; i++) {
    const midi = START_MIDI + i;
    const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
    const top = (TOTAL_KEYS - 1 - i) * ROW_HEIGHT;
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
