import MidiWorker from "../workers/midi.worker.js?worker";

/*
PURPOSE:
A utility function that wraps the Web Worker instantiation and communication inside a standard JavaScript Promise.

WHY IT EXISTS:
Using Web Workers directly involves messy event listeners (`onmessage`, `onerror`). By wrapping it in a Promise, React components or Zustand stores can simply call `await parseMidi(file)` as if it were a normal asynchronous function, hiding the complexity of the worker thread.

INPUT:
`file`: A File object representing the user-uploaded MIDI file from an <input type="file">.

OUTPUT:
A Promise that resolves with the `parsed` structured JSON data from the worker, or rejects with an Error.

REACT CONCEPT:
Not React-specific, but an architectural pattern to keep UI logic clean. It creates a Promise wrapper around an event-based API.

VIVA QUESTION:
Why wrap the Web Worker in a Promise instead of just using it directly in the React component?

VIVA ANSWER:
Promises allow for cleaner, more readable asynchronous code using async/await. If we used the worker directly in a component, we'd have to set up and tear down event listeners, making the component bloated and harder to test. The Promise pattern provides a clean 'fire-and-forget' interface.
*/
export function parseMidi(file) {
  return new Promise(async (resolve, reject) => {
    /*
    PURPOSE:
    Converts the File object into an ArrayBuffer.
    
    WHY IT EXISTS:
    Web Workers cannot easily process DOM File objects directly. ArrayBuffers represent raw binary data, which can be efficiently transferred to the worker.
    */
    const buffer = await file.arrayBuffer();
    
    /*
    PURPOSE:
    Instantiates the worker thread. The `?worker` suffix is a Vite specific syntax that tells the bundler to compile it as a separate worker script.
    */
    const worker = new MidiWorker();

    /*
    PURPOSE:
    Listens for the successful (or failed) parsing result from the worker.
    */
    worker.onmessage = (e) => {
      const { success, parsed, error } = e.data;
      if (success) {
        resolve(parsed); // Resolves the outer Promise
      } else {
        reject(new Error(error)); // Rejects the outer Promise
      }
      /*
      PURPOSE:
      Kills the worker thread.
      
      WHY IT EXISTS:
      CRITICAL FOR PERFORMANCE. If we don't terminate the worker, it stays alive in memory. Doing this multiple times would cause a memory leak and eventually crash the browser.
      */
      worker.terminate();
    };

    /*
    PURPOSE:
    Catches fatal errors within the worker thread itself (e.g., script fails to load).
    */
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    /*
    PURPOSE:
    Sends the binary data to the worker.
    
    WHY IT EXISTS:
    The second argument `[buffer]` is a Transferable Object array. This is a massive performance optimization. It TRANSFERS ownership of the memory from the main thread to the worker thread, rather than copying it. Copying a 10MB file takes time; transferring it is nearly instantaneous (O(1)).
    */
    worker.postMessage({ buffer, name: file.name }, [buffer]);
  });
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Provides a clean, Promise-based wrapper around the `midi.worker.js` Web Worker, allowing the rest of the application to parse MIDI files using standard `async/await` syntax.

Data Flow:
File Object -> `arrayBuffer()` -> `worker.postMessage` (Transferable) -> Worker processes -> `worker.onmessage` -> Promise `resolve()` -> Garbage collection (`worker.terminate()`).

Important Variables:
- `worker`: An instance of the dedicated Web Worker.
- `buffer`: The binary representation of the MIDI file.

Important Functions:
- `parseMidi`: The exported wrapper function.

React Concepts Used:
Architectural separation of concerns. Hides complex event-based APIs from React components.

JavaScript Concepts Used:
- Promises (`new Promise((resolve, reject) => {...})`)
- Asynchronous wrappers
- ArrayBuffers and Transferable Objects

Browser APIs Used:
- File API (`file.arrayBuffer()`)
- Web Worker API (`new Worker`, `postMessage`, `onmessage`, `terminate`)

Performance Considerations:
- **Transferable Objects:** Passes `[buffer]` to `postMessage` to transfer ownership without copying memory (Zero-copy transfer).
- **Memory Management:** Explicitly calls `worker.terminate()` to prevent memory leaks after the one-off parsing job is done.

Most Likely Viva Questions:
1. Explain how `parseMidi` works and what it returns.
2. Why is the second argument `[buffer]` used in `postMessage`?
3. What happens if you forget to call `worker.terminate()`?

Tricky Follow-Up Questions:
1. Why does the Vite import have `?worker` at the end? (Answer: It's a Vite bundler directive telling it to treat the imported file as a Web Worker asset, not a standard JS import).
2. Can `file.arrayBuffer()` block the main thread? (Answer: No, it is asynchronous and returns a Promise).

Expected Answers:
1. It wraps a Web Worker inside a Promise. It reads a File as an ArrayBuffer, sends it to the worker, and resolves the promise when the worker replies, hiding the callback logic from the caller.
2. It treats the ArrayBuffer as a "Transferable Object". Instead of copying the memory to the worker thread (which takes time and doubles memory usage), it instantly transfers ownership to the worker.
3. The worker thread remains alive in the browser's background. If the user uploads 50 files, 50 threads will be spawned and left running, causing a severe memory leak and crashing the browser.
*/
