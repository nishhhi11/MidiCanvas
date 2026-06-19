# FILE SUMMARY: src/stores/uiStore.js

## Purpose
Tracks global UI toggles and layout modes.

## React Concepts Used
- Global State Management.

## Most Likely Viva Questions
1. Why use Zustand here instead of React Context?

## Expected Answers
1. Zustand provides a simpler API without the need for Context Providers wrapping the component tree, and it avoids unnecessary re-renders that typically plague Context API when state changes.
