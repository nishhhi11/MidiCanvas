/**
 * useMidiParser.js
 * Custom hook for parsing .mid / .midi files into structured MidiData.
 */
import { useCallback } from 'react';
import { parseMidi } from '../utils/midiParser';
import { useMidiStore } from '../stores/midiStore';

/**
 * Provides a `parse` function that reads a File/Blob, decodes MIDI,
 * and pushes the result into the midiStore.
 */
export function useMidiParser() {
  const { setMidiData, setUploadedFile } = useMidiStore();

  const parse = useCallback(async (file) => {
    if (!file) return null;
    try {
      setUploadedFile(file.name || 'Untitled.mid');
      const parsed = await parseMidi(file);
      setMidiData(parsed);
      return parsed;
    } catch (err) {
      console.error('[useMidiParser] Failed to parse MIDI file:', err);
      return null;
    }
  }, [setMidiData, setUploadedFile]);

  return { parse };
}
