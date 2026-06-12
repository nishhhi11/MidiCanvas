import { Mailbox, Upload, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileCard from "./FileCard";

export default function SavedFilesList({ files, onLoad, onDelete, onExport, hasFiles }) {
  const navigate = useNavigate();

  if (!hasFiles) {
    return (
      <div className="flex flex-col gap-12">
        <div className="text-center py-20 mt-8 glass-panel border border-white/5 bg-[#111]/50 rounded-[40px] flex flex-col items-center shadow-lg">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.02)] border border-white/10">
            <Mailbox size={32} className="text-zinc-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No saved projects yet</h2>
          <p className="text-zinc-400 max-w-md mb-8 text-lg">
            Your saved MIDI projects will appear here. Head over to the piano roll editor to import and save your first track!
          </p>
          <button
            onClick={() => navigate("/studio")}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.8), rgba(147,51,234,0.8))',
              boxShadow: '0 0 20px rgba(168,85,247,0.3)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Upload size={20} />
            Go to Editor
          </button>
        </div>

      </div>
    );
  }

  if (files.length === 0) {
      // Has files but none match the search/filter
      return (
        <div className="text-center py-20 border border-white/5 bg-[#111] rounded-3xl mt-8">
          <h2 className="text-xl font-bold text-zinc-400">No results found</h2>
          <p className="text-zinc-500 mt-2">
            Try adjusting your search query or filters.
          </p>
        </div>
      );
  }

  // Determine recent projects (up to 3) if we are sorting by date.
  // Actually, let's just always show recent projects as the first 3 if there's no search query.
  // If there's a search, we just show the results grid.
  const isDefaultView = files.length > 3; // or could pass `searchQuery` down. We'll just show them always.
  const recordings = files.filter(f => f.name.startsWith("Recording "));
  const otherFiles = files.filter(f => !f.name.startsWith("Recording "));
  const recentFiles = [...otherFiles].sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, 3);
  // For simplicity, we just render the grid. Wait, the user specifically asked for "Recent Projects" at the very top.
  // Let's implement it cleanly:

  return (
    <div className="mt-8 flex flex-col gap-12">
      {/* Recent Projects Section */}
      {recentFiles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFiles.map((file) => (
              <FileCard
                key={`recent-${file.id}`}
                file={file}
                onLoad={onLoad}
                onDelete={onDelete}
                onExport={onExport}
              />
            ))}
          </div>
        </section>
      )}

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Mailbox size={18} className="text-zinc-500" />
            <h2 className="text-xl font-bold text-white">All Projects</h2>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onLoad={onLoad}
              onDelete={onDelete}
              onExport={onExport}
            />
          ))}
        </div>
      </section>

      {/* Recordings Section */}
      {recordings.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 mt-8">
            <span className="text-red-500 animate-pulse text-xl">🔴</span>
            <h2 className="text-xl font-bold text-white">My Recordings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onLoad={onLoad}
                onDelete={onDelete}
                onExport={onExport}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
