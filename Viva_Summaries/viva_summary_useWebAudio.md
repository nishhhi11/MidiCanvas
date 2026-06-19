# FILE SUMMARY: src/hooks/useWebAudio.js

## Purpose
An alias/re-export file. It exports `usePlaybackController` from `usePlayback.js`.

## React Concepts Used
- ES6 Module Re-exporting.

## Most Likely Viva Questions
1. Why does this file exist if it only re-exports another hook?

## Expected Answers
1. This is an architectural convenience. It allows components to import from `useWebAudio` if the name makes more semantic sense in their specific context (e.g., when they only care about audio rendering), while pointing to the same underlying `usePlayback` hook implementation.
