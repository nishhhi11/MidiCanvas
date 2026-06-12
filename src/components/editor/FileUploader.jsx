import { useDropzone } from "react-dropzone";

export default function MidiUploader({ onFileUpload }) {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "audio/midi": [".mid", ".midi"],
        },
        onDrop: (files) => {
            if (files.length > 0) {
                onFileUpload(files[0]);
            }
        },
    });

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-zinc-700 p-8 rounded-xl cursor-pointer"
        >
            <input {...getInputProps()} />
            <p>Drop a MIDI file here or click to upload</p>
        </div>
    );
}