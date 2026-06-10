import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SongLibraryPage() {
    const songs = [
        "Fur Elise",
        "Canon In D",
        "River Flows In You",
        "Interstellar",
        "Harry Potter Theme",
        "Pirates Of The Caribbean",
        "Clair De Lune",
        "Perfect",
    ];

    return (
        <div className="min-h-screen bg-black text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between">
                    <h1 className="text-5xl font-bold">
                        Song Library 🎹
                    </h1>

                    <Link
                        to="/dashboard"
                        className="px-6 py-3 rounded-xl border border-zinc-800"
                    >
                        Dashboard
                    </Link>
                </div>

                <input
                    placeholder="Search songs..."
                    className="w-full mt-10 p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
                />

                <div className="flex flex-wrap gap-3 mt-8">
                    <button className="px-4 py-2 rounded-full bg-white text-black">
                        Classical
                    </button>

                    <button className="px-4 py-2 rounded-full border border-zinc-700">
                        Movies
                    </button>

                    <button className="px-4 py-2 rounded-full border border-zinc-700">
                        Pop
                    </button>

                    <button className="px-4 py-2 rounded-full border border-zinc-700">
                        Anime
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                    {songs.map((song) => (
                        <motion.div
                            key={song}
                            whileHover={{
                                y: -6,
                                scale: 1.02,
                            }}
                            className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden"
                        >
                            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                <div className="text-7xl">
                                    🎹
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-semibold text-lg">
                                    {song}
                                </h3>

                                <Link
                                    to={`/lesson/${encodeURIComponent(song)}`}
                                    className="inline-block mt-4 text-white"
                                >
                                    Start Learning →
                                </Link>
                            </div>

                        </motion.div>
                    ))}

                </div>

            </div>

        </div>
    );
}