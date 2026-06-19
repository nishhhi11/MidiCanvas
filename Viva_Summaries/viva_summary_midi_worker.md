# FILE SUMMARY: src/workers/midi.worker.js

## Purpose
A Web Worker script responsible for offloading heavy MIDI file parsing from the main browser thread. It uses `@tonejs/midi` to convert binary MIDI data into a structured JSON format optimized for React state and Canvas rendering.

## Data Flow
Main Thread (File upload) -> Web Worker (`self.onmessage`) -> Binary Buffer parsed by `@tonejs/midi` -> Tracks/Notes flattened and extracted -> Normalized Object -> Main Thread (`self.postMessage`).

## Important Variables
- `midi`: The instantiated `@tonejs/midi` object containing raw parsed data.
- `notes`: A flattened array of all note events across all tracks.
- `parsed`: The final normalized object sent back to the application.

## Important Functions
- `self.onmessage`: The entry point that listens for messages from the main thread.

## React Concepts Used
None directly (this is pure JavaScript). However, it enables React to stay responsive by not blocking the main thread.

## JavaScript Concepts Used
- Asynchronous programming (async/await)
- Destructuring assignment (`{ buffer, name } = e.data`)
- Array methods (`forEach`, `map`)
- Optional chaining (`?.`)

## Browser APIs Used
- Web Worker API (`self.onmessage`, `self.postMessage`)

## Performance Considerations
- **O(N) time complexity** for flattening notes.
- Offloads parsing to prevent main thread blocking (jank-free UI).
- Normalizes data to drop unnecessary object references, aiding garbage collection.

## Most Likely Viva Questions
1. Why use a Web Worker here instead of standard async/await in a component?
2. How does the Web Worker communicate with React?
3. What is the time complexity of the flattening loop?

## Tricky Follow-Up Questions
1. What happens to the memory of the `buffer` passed into the worker?
2. Could you have multiple Web Workers parsing different files simultaneously?

## Expected Answers
1. Even with async/await, CPU-bound tasks like parsing loops block the main thread execution. Web Workers run in a completely separate OS thread, preventing the UI from freezing.
2. Via the `postMessage` API and listening to `onmessage` events.
3. O(N) where N is the total number of notes across all tracks.
4. *Follow-up 1:* By default, the buffer is cloned. However, if passed as a transferable object, ownership is transferred and it no longer consumes memory in the main thread.
5. *Follow-up 2:* Yes, by instantiating new worker objects, though this project only parses one at a time.
