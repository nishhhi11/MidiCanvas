import { Home, Upload as UploadIcon, Music, Library as LibraryIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6">
      <div className="space-y-4">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 w-full text-left"
        >
          <Home size={18} />
          Home
        </button>

        <button
          onClick={() => navigate("/learn")}
          className="flex items-center gap-3 w-full text-left"
        >
          <Music size={18} />
          Learn Songs
        </button>

        <button
          onClick={() => navigate("/library")}
          className="flex items-center gap-3 w-full text-left"
        >
          <LibraryIcon size={18} />
          My Library
        </button>

        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-3 w-full text-left"
        >
          <UploadIcon size={18} />
          Upload MIDI
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 w-full text-left"
        >
          <User size={18} />
          Profile
        </button>

      </div>
    </aside>
  );
}