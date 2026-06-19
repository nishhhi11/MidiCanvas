# FILE SUMMARY: src/utils/midiParser.js

## Purpose
Provides a clean, Promise-based wrapper around the `midi.worker.js` Web Worker, allowing the rest of the application to parse MIDI files using standard `async/await` syntax.

## Data Flow
File Object -> `arrayBuffer()` -> `worker.postMessage` (Transferable) -> Worker processes -> `worker.onmessage` -> Promise `resolve()` -> Garbage collection (`worker.terminate()`).

## Important Variables
- `worker`: An instance of the dedicated Web Worker.
- `buffer`: The binary representation of the MIDI file.

## Important Functions
- `parseMidi`: The exported wrapper function.

## React Concepts Used
Architectural separation of concerns. Hides complex event-based APIs from React components.

## JavaScript Concepts Used
- Promises (`new Promise((resolve, reject) => {...})`)
- Asynchronous wrappers
- ArrayBuffers and Transferable Objects

## Browser APIs Used
- File API (`file.arrayBuffer()`)
- Web Worker API (`new Worker`, `postMessage`, `onmessage`, `terminate`)

## Performance Considerations
- **Transferable Objects:** Passes `[buffer]` to `postMessage` to transfer ownership without copying memory (Zero-copy transfer).
- **Memory Management:** Explicitly calls `worker.terminate()` to prevent memory leaks after the one-off parsing job is done.

## Most Likely Viva Questions
1. Explain how `parseMidi` works and what it returns.
2. Why is the second argument `[buffer]` used in `postMessage`?
3. What happens if you forget to call `worker.terminate()`?

## Tricky Follow-Up Questions
1. Why does the Vite import have `?worker` at the end?
2. Can `file.arrayBuffer()` block the main thread?

## Expected Answers
1. It wraps a Web Worker inside a Promise. It reads a File as an ArrayBuffer, sends it to the worker, and resolves the promise when the worker replies, hiding the callback logic from the caller.
2. It treats the ArrayBuffer as a "Transferable Object". Instead of copying the memory to the worker thread (which takes time and doubles memory usage), it instantly transfers ownership to the worker.
3. The worker thread remains alive in the browser's background. If the user uploads 50 files, 50 threads will be spawned and left running, causing a severe memory leak and crashing the browser.
4. *Follow-up 1:* It's a Vite bundler directive telling it to treat the imported file as a Web Worker asset, not a standard JS import.
5. *Follow-up 2:* No, `arrayBuffer()` is asynchronous and returns a Promise, so it doesn't block.
