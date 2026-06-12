/**
 * useIndexedDB.js
 * Custom hook wrapper around the Dexie-based library store.
 */
import { useEffect } from 'react';
import { useLibraryStore } from '../stores/libraryStore';

/**
 * Provides easy access to saved MIDI files stored in IndexedDB via Dexie.
 * Automatically fetches files on mount.
 */
export function useIndexedDB() {
  const {
    savedFiles,
    isLoading,
    fetchSavedFiles,
    saveFile,
    deleteFile,
    getFileRawData,
  } = useLibraryStore();

  useEffect(() => {
    fetchSavedFiles();
  }, [fetchSavedFiles]);

  return {
    savedFiles,
    isLoading,
    saveFile,
    deleteFile,
    getFileRawData,
    refresh: fetchSavedFiles,
  };
}
