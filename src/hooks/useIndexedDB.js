import { useEffect } from 'react';
import { useLibraryStore } from '../stores/libraryStore';

/*
PURPOSE:
A wrapper hook for the `useLibraryStore` that automatically triggers a data fetch on component mount.

REACT CONCEPT:
Composition of Custom Hooks.
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

  /*
  VIVA QUESTION:
  Why is `fetchSavedFiles` inside the dependency array of this `useEffect`?

  VIVA ANSWER:
  React's exhaustive-deps rule requires all functions from component/hook scope used inside an effect to be declared as dependencies. If `fetchSavedFiles` were ever recreated (e.g., if the store implementation changed), the effect would safely re-run with the new function reference. Since Zustand guarantees stable function references, it effectively acts as an "on mount" `[]` dependency array but satisfies the linter safely.
  */
  useEffect(() => {
    fetchSavedFiles();
  }, [fetchSavedFiles]);

  return {
    savedFiles,
    isLoading,
    saveFile,
    deleteFile,
    getFileRawData,
    refresh: fetchSavedFiles, // Alias for manual refreshing
  };
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Connects components to the global IndexedDB Library store while ensuring the data is automatically hydrated on mount.

React Concepts Used:
- `useEffect` for side-effects on mount.
- Hook Composition (calling a Zustand hook inside a custom React hook).
*/
