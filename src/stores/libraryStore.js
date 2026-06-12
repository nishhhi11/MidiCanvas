import { create } from 'zustand';
import Dexie from 'dexie';

export const db = new Dexie('PianoFlowDatabase');
db.version(1).stores({
  midiFiles: '++id, name, uploadedAt'
});

export const useLibraryStore = create((set, get) => ({
  savedFiles: [],
  isLoading: false,

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
