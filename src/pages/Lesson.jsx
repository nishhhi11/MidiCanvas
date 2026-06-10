import { useParams } from "react-router-dom";

import PianoKeyboard from "../components/hero/PianoKeyboard";
import NoteHighway from "../components/hero/NoteHighway";
import FloatingNotes from "../components/hero/FloatingNotes";

export default function Lesson() {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-5xl font-bold">
                    {decodeURIComponent(id)}
                </h1>

                <p className="text-zinc-400 mt-3">
                    Interactive Piano Lesson
                </p>

                <div className="mt-8 h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-white rounded-full" />
                </div>

                <div className="relative mt-12 h-[650px] rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">

                    <FloatingNotes />
                    <NoteHighway />
                    <PianoKeyboard />

                </div>

                <div className="flex gap-4 mt-8">

                    <button className="px-6 py-3 bg-white text-black rounded-xl font-semibold">
                        Play
                    </button>

                    <button className="px-6 py-3 border border-zinc-700 rounded-xl">
                        Pause
                    </button>

                </div>

            </div>

        </div>
    );
}