import { Home, Mic2, Library as LibraryIcon, User, Music, Trash2, Loader2 } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLibraryStore } from "../../stores/libraryStore";
import { useMidiStore } from "../../stores/midiStore";
import { parseMidi } from "../../utils/midiParser";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedFiles, isLoading, fetchSavedFiles, deleteFile, getFileRawData } = useLibraryStore();
  const { setMidiData, setUploadedFile } = useMidiStore();

  useEffect(() => {
    fetchSavedFiles();
  }, [fetchSavedFiles]);

  const isActive = (path) => location.pathname === path;

  const handleLoadFile = async (file) => {
    try {
      const rawData = await getFileRawData(file.id);
      if (!rawData) return;

      const blob = new Blob([rawData], { type: 'audio/midi' });
      const parsed = await parseMidi(blob);

      setUploadedFile(file.name);
      setMidiData(parsed);
      navigate("/studio");
    } catch (err) {
      console.error("Failed to load saved file", err);
    }
  };

  const NavItem = ({ icon: Icon, label, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive(path) 
          ? "bg-purple-500/10 text-purple-400 font-medium" 
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <aside className="w-64 min-h-screen border-r border-white/5 bg-[#050505] p-6 flex flex-col">

      <Link to="/" className="flex items-center gap-3 mb-12 px-4 hover:opacity-80 transition-opacity">
        <span className="text-xl">🎹</span>
        <h1 className="font-bold text-lg text-white">PianoFlow</h1>
      </Link>

      <div className="space-y-2 flex-1">
        <NavItem icon={Mic2} label="MIDI Studio" path="/studio" />
        <NavItem icon={LibraryIcon} label="Library" path="/library" />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">My Library</h2>
          {isLoading && <Loader2 size={12} className="text-zinc-500 animate-spin" />}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
          {savedFiles.length === 0 && !isLoading && (
            <p className="text-[10px] text-zinc-600 px-2">No files saved yet.</p>
          )}
          {savedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleLoadFile(file)}>
              <Music size={14} className="text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 truncate">{file.name}</p>
                <p className="text-[10px] text-zinc-600">{Math.round(file.duration)}s • {file.trackCount} tracks</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}