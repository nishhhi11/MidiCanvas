import { create } from 'zustand';

/*
PURPOSE:
A minimal Zustand store to track the current application mode (e.g., 'studio' vs other modes).

REACT CONCEPT:
Global State Management.

VIVA QUESTION:
Why use Zustand here instead of React Context?

VIVA ANSWER:
Zustand provides a simpler API without the need for Context Providers wrapping the component tree, and it avoids unnecessary re-renders that typically plague Context API when state changes.
*/
export const useUIStore = create((set) => ({
  mode: 'studio', 
  setMode: (m) => set({ mode: m }),
}));

/*
========================================
FILE SUMMARY
========================================

Purpose:
Tracks global UI toggles and layout modes.
*/
