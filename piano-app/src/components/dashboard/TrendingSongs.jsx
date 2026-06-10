import { useNavigate } from "react-router-dom";

const songs = [
  "Kesariya",
  "Tum Hi Ho",
  "Kal Ho Naa Ho",
  "Raabta",
  "Agar Tum Saath Ho",
  "Tujh Mein Rab Dikhta Hai",
];

export default function TrendingSongs() {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Trending Bollywood
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div
            key={song}
            onClick={() => navigate("/learn")}
            className="cursor-pointer bg-black border border-zinc-800 rounded-xl p-4 hover:border-orange-500 transition"
          >
            <h3 className="font-semibold">
              {song}
            </h3>

            <p className="text-zinc-500 text-sm mt-2">
              Piano Lesson Available
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
