import { Midi } from "@tonejs/midi";

/*
PURPOSE:
This Web Worker handles the CPU-intensive task of parsing binary MIDI files into structured JSON data.

WHY IT EXISTS:
Parsing large MIDI files can block the main JavaScript thread, causing the React UI to freeze. By offloading this to a Web Worker, the application remains responsive while parsing happens in the background.

INPUT:
`e.data` object containing:
- `buffer`: The binary ArrayBuffer of the uploaded MIDI file.
- `name`: The string name of the file.

OUTPUT:
Posts a message back to the main thread with either:
- `{ success: true, parsed: Object }` containing structured MIDI data.
- `{ success: false, error: String }` if parsing fails.

REACT CONCEPT:
Not React-specific. This uses the Browser's Web Worker API to achieve multi-threading in JavaScript.

VIVA QUESTION:
Why did you use a Web Worker for MIDI parsing instead of doing it directly in the component?

VIVA ANSWER:
JavaScript is single-threaded. If a user uploads a massive MIDI file with thousands of notes, parsing it on the main thread would block UI rendering and user interactions, making the app feel frozen. The Web Worker offloads this heavy computation to a separate background thread, ensuring smooth UI performance.
*/
self.onmessage = async (e) => {
  try {
    const { buffer, name } = e.data;
    const midi = new Midi(buffer);
    let totalNotes = 0;
    
    /*
    PURPOSE:
    Flattens a multi-track MIDI file into a single array of note objects.
    
    WHY IT EXISTS:
    The Piano Roll Canvas renders all notes on a single 2D plane regardless of track. Flattening the structure makes rendering and playback calculations O(N) where N is total notes, rather than having to nest loops.
    
    TIME COMPLEXITY:
    O(T * N_t) where T is number of tracks and N_t is notes per track. Effectively O(N) where N is total notes.
    */
    const notes = [];

    midi.tracks.forEach((track, trackIndex) => {
      track.notes.forEach((note, noteIndex) => {
        totalNotes++;
        notes.push({
          id: `t${trackIndex}-n${noteIndex}`,
          track: trackIndex,
          name: note.name,
          midi: note.midi,
          velocity: note.velocity,
          duration: note.duration,
          time: note.time,
        });
      });
    });

    /*
    PURPOSE:
    Constructs the final normalized data object.
    
    WHY IT EXISTS:
    The raw output from @tonejs/midi contains deeply nested objects and Tone.js specific data that React components don't need. This step extracts only the necessary primitive values to optimize memory and make state management easier in Zustand.
    */
    const parsed = {
      fileName: name,
      tempo: midi.header.tempos?.[0]?.bpm ? Math.round(midi.header.tempos[0].bpm) : 120,
      trackCount: midi.tracks.length,
      noteCount: totalNotes,
      duration: Math.round(midi.duration),
      timeSignature: midi.header.timeSignatures?.[0]
        ? `${midi.header.timeSignatures[0].timeSignature[0]}/${midi.header.timeSignatures[0].timeSignature[1]}`
        : "4/4",
      notes,
      tracks: midi.tracks.map((track, index) => ({
        id: index,
        name: track.name || `Track ${index + 1}`,
        noteCount: track.notes.length,
      })),
    };

    self.postMessage({ success: true, parsed });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

/*
========================================
FILE SUMMARY
========================================

Purpose:
A Web Worker script responsible for offloading heavy MIDI file parsing from the main browser thread. It uses `@tonejs/midi` to convert binary MIDI data into a structured JSON format optimized for React state and Canvas rendering.

Data Flow:
Main Thread (File upload) -> Web Worker (`self.onmessage`) -> Binary Buffer parsed by `@tonejs/midi` -> Tracks/Notes flattened and extracted -> Normalized Object -> Main Thread (`self.postMessage`).

Important Variables:
- `midi`: The instantiated `@tonejs/midi` object containing raw parsed data.
- `notes`: A flattened array of all note events across all tracks.
- `parsed`: The final normalized object sent back to the application.

Important Functions:
- `self.onmessage`: The entry point that listens for messages from the main thread.

React Concepts Used:
None directly (this is pure JavaScript). However, it enables React to stay responsive.

JavaScript Concepts Used:
- Asynchronous programming (async/await)
- Destructuring assignment (`{ buffer, name } = e.data`)
- Array methods (`forEach`, `map`)
- Optional chaining (`?.`)

Browser APIs Used:
- Web Worker API (`self.onmessage`, `self.postMessage`)

Performance Considerations:
- O(N) time complexity for flattening notes.
- Offloads parsing to prevent main thread blocking (jank-free UI).
- Normalizes data to drop unnecessary object references, aiding garbage collection.

Most Likely Viva Questions:
1. Why use a Web Worker here instead of standard async/await in a component?
2. How does the Web Worker communicate with React?
3. What is the time complexity of the flattening loop?

Tricky Follow-Up Questions:
1. What happens to the memory of the `buffer` passed into the worker? (Answer: It is copied unless passed as transferable objects).
2. Could you have multiple Web Workers parsing different files simultaneously? (Answer: Yes, by instantiating new worker objects).

Expected Answers:
1. Even with async/await, CPU-bound tasks like parsing loops block the main thread execution. Web Workers run in a completely separate OS thread.
2. Via the `postMessage` API and listening to `onmessage` events.
3. O(N) where N is the total number of notes across all tracks.
*/
