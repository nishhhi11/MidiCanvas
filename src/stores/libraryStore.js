import { create } from 'zustand';
import Dexie from 'dexie';

/*
PURPOSE:
Initialize a local IndexedDB database using Dexie to store MIDI files persistently across sessions.
*/
export const db = new Dexie('PianoFlowDatabase');
db.version(1).stores({
  midiFiles: '++id, name, uploadedAt'
});

/*
PURPOSE:
A Zustand store managing the UI state for the Library page and handling the async operations to read/write to IndexedDB.

REACT CONCEPT:
Global State Management combined with asynchronous side-effects.
*/
export const useLibraryStore = create((set, get) => ({
  savedFiles: [],
  isLoading: false,

  /*
  PURPOSE:
  Fetches all stored files from IndexedDB, strips out the heavy binary `rawData` to keep memory usage low, and stores the lightweight metadata in Zustand.
  */
  fetchSavedFiles: async () => {
    set({ isLoading: true });
    try {
      const files = await db.midiFiles.toArray();
      files.sort((a, b) => b.uploadedAt - a.uploadedAt);

      const listFiles = files.map(f => ({
        id: f.id,
        name: f.name,
        uploadedAt: f.uploadedAt,
        duration: f.duration,
        trackCount: f.trackCount,
        noteCount: f.noteCount || 0,
        size: f.size || (f.rawData ? f.rawData.byteLength : 0)
      }));
      set({ savedFiles: listFiles });
    } catch (err) {
      console.error('Failed to fetch library', err);
    } finally {
      set({ isLoading: false });
    }
  },

  /*
  VIVA QUESTION:
  Why do you call `await get().fetchSavedFiles()` after saving or deleting a file?

  VIVA ANSWER:
  This ensures that the Zustand state (`savedFiles`) stays perfectly in sync with the actual data in IndexedDB. Instead of manually pushing or splicing the `savedFiles` array in memory, re-fetching guarantees we have the exact source of truth from the database, preventing UI mismatches.
  */
  saveFile: async (fileMeta, rawData) => {
    try {
      const id = await db.midiFiles.add({
        name: fileMeta.name || 'Unknown',
        duration: fileMeta.duration || 0,
        trackCount: fileMeta.trackCount || 0,
        noteCount: fileMeta.noteCount || 0,
        size: rawData ? rawData.byteLength : 0,
        uploadedAt: Date.now(),
        rawData 
      });
      await get().fetchSavedFiles();
      return id;
    } catch (err) {
      console.error('Failed to save file to library', err);
      return null;
    }
  },

  deleteFile: async (id) => {
    try {
      await db.midiFiles.delete(id);
      await get().fetchSavedFiles();
    } catch (err) {
      console.error('Failed to delete file', err);
    }
  },

  /*
  PURPOSE:
  A utility to specifically fetch the heavy binary `rawData` only when a user actually wants to open the file in the editor, keeping the initial library load fast.
  */
  getFileRawData: async (id) => {
    try {
      const record = await db.midiFiles.get(id);
      return record?.rawData || null;
    } catch (err) {
      console.error('Failed to get raw data', err);
      return null;
    }
  }
}));

/*
========================================
FILE SUMMARY
========================================

Purpose:
Manages the application's local persistence layer (IndexedDB) and provides a global Zustand store for components to interact with the Library data.

React Concepts Used:
- Global state management (Zustand).

JavaScript Concepts Used:
- IndexedDB wrapper (Dexie).
- Asynchronous data fetching.
*/
