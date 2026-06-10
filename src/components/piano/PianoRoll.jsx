import Playhead from "./Playhead";

export default function PianoRoll({ notes = [] }) {
    if (!notes.length) {
        return null;
    }

    const minMidi = Math.min(...notes.map((n) => n.midi));
    const maxMidi = Math.max(...notes.map((n) => n.midi));
    const range = maxMidi - minMidi || 1;

    return (<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"> <h2 className="text-2xl font-bold mb-4">
        Piano Roll </h2>

        ```
        <div className="overflow-x-auto">
            <div
                className="relative bg-black rounded-lg"
                style={{
                    width: "4000px",
                    height: "500px",
                }}
            >
                {/* Grid */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-zinc-800"
                        style={{
                            left: `${i * 150}px`,
                        }}
                    />
                ))}

                <Playhead />

                {notes.map((note, index) => (
                    <div
                        key={index}
                        className="absolute rounded-sm bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/30"
                        style={{
                            left: note.time * 60,
                            top:
                                450 -
                                ((note.midi - minMidi) / range) * 400,
                            width: Math.max(note.duration * 80, 6),
                            height: 10,
                        }}
                    />
                ))}
            </div>
        </div>
    </div>

);
}
