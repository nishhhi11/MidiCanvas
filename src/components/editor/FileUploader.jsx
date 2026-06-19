import { useDropzone } from "react-dropzone";

/*
PURPOSE:
Provides a drag-and-drop zone and click-to-upload area for MIDI files.

REACT CONCEPT:
Using a third-party hook (`react-dropzone`) for complex DOM event handling.

VIVA QUESTION:
Why use `react-dropzone` instead of just an `<input type="file" />`?

VIVA ANSWER:
While an `<input>` handles clicking to upload, native drag-and-drop is surprisingly complex in raw HTML/JS. You have to manage `dragenter`, `dragover`, `dragleave`, and `drop` events, prevent default browser behaviors (which try to open the file in a new tab), and handle visual states. `react-dropzone` encapsulates all this boilerplate into a clean hook.
*/
export default function MidiUploader({ onFileUpload }) {
    const { getRootProps, getInputProps } = useDropzone({
        // Restrict accepted files to MIDI formats
        accept: {
            "audio/midi": [".mid", ".midi"],
        },
        // Callback when a valid file is dropped
        onDrop: (files) => {
            if (files.length > 0) {
                // Pass the File object up to the parent component
                onFileUpload(files[0]);
            }
        },
    });

    return (
        <div
            // Spread the necessary event handlers and ARIA attributes onto the container
            {...getRootProps()}
            className="border-2 border-dashed border-zinc-700 p-8 rounded-xl cursor-pointer"
        >
            {/* The hidden native input element that opens the OS file picker on click */}
            <input {...getInputProps()} />
            <p>Drop a MIDI file here or click to upload</p>
        </div>
    );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A dedicated component for handling the initial drag-and-drop or click-to-upload of MIDI files.

React Concepts Used:
- Render Props / Hook Spreading (`{...getRootProps()}`).
- Prop delegation (`onFileUpload`).
*/