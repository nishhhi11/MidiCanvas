# FILE SUMMARY: src/components/editor/FileUploader.jsx

## Purpose
A dedicated component for handling the initial drag-and-drop or click-to-upload of MIDI files.

## React Concepts Used
- Render Props / Hook Spreading (`{...getRootProps()}`).
- Prop delegation (`onFileUpload`).

## Most Likely Viva Questions
1. Why use `react-dropzone` instead of just an `<input type="file" />`?

## Expected Answers
1. While an `<input>` handles clicking to upload, native drag-and-drop is surprisingly complex in raw HTML/JS. You have to manage `dragenter`, `dragover`, `dragleave`, and `drop` events, prevent default browser behaviors (which try to open the file in a new tab), and handle visual states. `react-dropzone` encapsulates all this boilerplate into a clean hook.
