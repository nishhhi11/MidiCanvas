import { Home, Mic2, Library as LibraryIcon, User, Music, Trash2, Loader2 } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLibraryStore } from "../../stores/libraryStore";
import { useMidiStore } from "../../stores/midiStore";
import { parseMidi } from "../../utils/midiParser";

/*
PURPOSE:
A navigation sidebar specifically used in the Library view, allowing users to switch between the Studio and Library, and also listing their saved MIDI files.

REACT CONCEPT:
Component consuming multiple global stores and routing hooks.
*/
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedFiles, isLoading, fetchSavedFiles, deleteFile, getFileRawData } = useLibraryStore();
  const { setMidiData, setUploadedFile } = useMidiStore();

  /*
  PURPOSE:
  Fetches the list of saved files from IndexedDB when the Sidebar mounts.
  */
  useEffect(() => {
    fetchSavedFiles();
  }, [fetchSavedFiles]);

  const isActive = (path) => location.pathname === path;

  /*
  PURPOSE:
  Loads a previously saved MIDI file back into the editor.

  VIVA QUESTION:
  Why do you parse the MIDI again here instead of just loading a saved JSON object?

  VIVA ANSWER:
  IndexedDB has a 5MB storage limit per entry on some older browsers, and saving the massive parsed JSON (which contains hundreds of thousands of note objects) can exceed quotas quickly. Instead, we save the highly compressed raw binary MIDI data (`.mid` file buffer). When the user clicks a saved file, we fetch that binary array, turn it back into a Blob, and run our `parseMidi` worker on it. This trades a tiny bit of CPU time for massive storage savings.
  */
  const handleLoadFile = async (file) => {
    try {
      // 1. Fetch raw binary data from IndexedDB
      const rawData = await getFileRawData(file.id);
      if (!rawData) return;

      // 2. Reconstruct the file blob
      const blob = new Blob([rawData], { type: 'audio/midi' });
      
      // 3. Send to Web Worker to parse into JSON
      const parsed = await parseMidi(blob);

      // 4. Update Zustand and navigate to the Editor
      setUploadedFile(file.name);
      setMidiData(parsed);
      navigate("/studio");
    } catch (err) {
      console.error("Failed to load saved file", err);
    }
  };

  /*
  PURPOSE:
  A mini-component defined inside the main component for DRY code.
  (Note: It's generally better to define this *outside* the main component to prevent recreation on every render, but since it's just a UI wrapper, the performance hit is negligible here).
  */
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
A sidebar component handling primary navigation and displaying the user's IndexedDB file library.

Data Flow:
Mount -> `fetchSavedFiles` -> `useLibraryStore` reads IndexedDB -> Updates `savedFiles` state -> Sidebar renders list.
Click File -> `handleLoadFile` fetches binary data -> `parseMidi` Web Worker -> `setMidiData` -> `navigate('/studio')`.

React Concepts Used:
- Inline components (`NavItem`).
- Programmatic navigation (`useNavigate`).

Browser APIs Used:
- `Blob` API for converting binary data arrays back into file-like objects for the parser.

Most Likely Viva Questions:
1. Why is `e.stopPropagation()` needed on the delete button?

Expected Answers:
1. The delete button is nested *inside* the file card `div`. The file card has an `onClick` handler that loads the file into the editor. If you click delete, the browser fires the button's click event, but then the event "bubbles up" and fires the card's click event too (loading the file you just tried to delete). `e.stopPropagation()` stops this bubbling, so *only* the delete action occurs.
*/