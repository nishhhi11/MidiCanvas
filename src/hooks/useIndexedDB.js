
import { useEffect } from 'react';
import { useLibraryStore } from '../stores/libraryStore';

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
