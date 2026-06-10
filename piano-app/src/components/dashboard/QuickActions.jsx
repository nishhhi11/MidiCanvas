import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-3 gap-4">

      <button
        onClick={() => navigate("/upload")}
        className="bg-orange-500 text-black font-bold rounded-xl p-6"
      >
        Upload MIDI
      </button>

      <button
        onClick={() => navigate("/library")}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
      >
        Open Library
      </button>

      <button
        onClick={() => navigate("/practice")}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
      >
        Start Practice
      </button>

    </div>
  );
}
