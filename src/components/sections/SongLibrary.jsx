import kesariyaImg from "../../assets/songs/kesariya.png";
import tumHiHoImg from "../../assets/songs/tumhiho.png";
import kalHoNaaHoImg from "../../assets/songs/kalhonaho.png";
import channaMereyaImg from "../../assets/songs/channamereya.png";
import raabtaImg from "../../assets/songs/raabta.png";
import tujhMeinRabImg from "../../assets/songs/tujhmeinrab.png";

export default function SongLibrary() {
    const songs = [
        {
            title: "Kesariya",
            artist: "Arijit Singh",
            difficulty: "Beginner",
            image: kesariyaImg,
            gradient: "from-orange-500 via-pink-500 to-purple-600"
        },
        {
            title: "Tum Hi Ho",
            artist: "Arijit Singh",
            difficulty: "Intermediate",
            image: tumHiHoImg,
            gradient: "from-blue-500 via-purple-500 to-pink-500"
        },
        {
            title: "Kal Ho Naa Ho",
            artist: "Sonu Nigam",
            difficulty: "Advanced",
            image: kalHoNaaHoImg,
            gradient: "from-yellow-500 via-orange-500 to-red-500"
        },
        {
            title: "Channa Mereya",
            artist: "Arijit Singh",
            difficulty: "Intermediate",
            image: channaMereyaImg,
            gradient: "from-fuchsia-500 via-red-600 to-orange-400"
        },
        {
            title: "Raabta",
            artist: "Arijit Singh",
            difficulty: "Beginner",
            image: raabtaImg,
            gradient: "from-emerald-400 via-cyan-500 to-blue-600"
        },
        {
            title: "Tujh Mein Rab Dikhta Hai",
            artist: "Roop Kumar Rathod",
            difficulty: "Intermediate",
            image: tujhMeinRabImg,
            gradient: "from-violet-500 via-fuchsia-500 to-rose-500"
        },
    ];

    return (
        <section
            id="songs"
            className="py-40 px-6 bg-transparent"
        >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <p className="text-purple-400 uppercase tracking-widest text-sm">
                        Library
                    </p>

                    <h2 className="text-5xl font-bold text-white mt-4">
                        Learn With
                        <br />
                        Bollywood Hits
                    </h2>

                    <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
                        From classic melodies to modern blockbusters, learn the songs
                        you actually want to play.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {songs.map((song, index) => (
                        <div
                            key={index}
                            className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300"
                        >
                            {song.image ? (
                                <div className="h-56 relative overflow-hidden bg-zinc-900">
                                    <img 
                                        src={song.image} 
                                        alt={song.title} 
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                            ) : (
                                <div className={`h-56 bg-gradient-to-br ${song.gradient} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply transition-opacity group-hover:opacity-0 duration-300" />
                                    <div className="text-4xl font-bold text-white/90 px-6 text-center drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                                        {song.title}
                                    </div>
                                </div>
                            )}

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