export default function SongLibrary() {
    const songs = [
        {
            title: "Fur Elise",
            artist: "Beethoven",
            difficulty: "Beginner",
        },
        {
            title: "River Flows In You",
            artist: "Yiruma",
            difficulty: "Intermediate",
        },
        {
            title: "Canon In D",
            artist: "Pachelbel",
            difficulty: "Intermediate",
        },
        {
            title: "Nocturne Op.9",
            artist: "Chopin",
            difficulty: "Advanced",
        },
    ];

    return (
        <section
            id="songs"
            className="py-40 px-6 bg-black"
        >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <p className="text-purple-400 uppercase tracking-widest text-sm">
                        Library
                    </p>

                    <h2 className="text-5xl font-bold text-white mt-4">
                        Learn With
                        <br />
                        Real Songs
                    </h2>

                    <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
                        From classical masterpieces to modern hits, learn songs
                        you actually want to play.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {songs.map((song, index) => (
                        <div
                            key={index}
                            className="group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 hover:border-purple-500/40 transition-all duration-300"
                        >
                            <div className="h-56 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-black flex items-center justify-center">
                                <div className="text-7xl">🎹</div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-white text-xl font-semibold">
                                    {song.title}
                                </h3>

                                <p className="text-zinc-400 mt-2">
                                    {song.artist}
                                </p>

                                <div className="mt-5 inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">
                                    {song.difficulty}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}