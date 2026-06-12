import { Play, Trash2, Edit3, Download, MoreVertical, Clock, Layers, Activity, Calendar } from "lucide-react";
import { useState } from "react";

export default function FileCard({ file, onLoad, onDelete, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(file.uploadedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const durationStr = `${Math.floor(file.duration / 60)}:${Math.floor(file.duration % 60).toString().padStart(2, '0')}`;

  const previewStrips = ["▁▁▃▅▃▂▂▅▇▆▃▂", "▁▂▄▃▂▅▆▃▂▁▃▄▆", "▃▅▇▆▅▃▂▂▃▅▇▆▅", "▂▃▅▆▇▆▅▃▂▂▃▅▆", "▁▃▄▅▆▇▆▅▄▃▁▁▃"];
  const previewStrip = previewStrips[file.id.length % previewStrips.length];

  return (
    <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden flex flex-col p-5 group relative transition-all duration-300 hover:-translate-y-0.5 hover:border-[#333] hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-black text-purple-400 px-1.5 py-0.5 rounded border border-[#333]">
              [MIDI]
            </span>
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest">{previewStrip}</span>
          </div>
          <h3 className="text-white text-base font-bold truncate pr-4 mt-1 transition-colors group-hover:text-purple-400" title={file.name}>
            {file.name}
          </h3>
        </div>

        <div className="relative shrink-0">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden py-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(file.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2 relative z-50 pointer-events-auto cursor-pointer"
                >
                  <Trash2 size={14} /> Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6 relative z-10 text-xs font-medium">
        <div className="flex items-center gap-2 text-zinc-300">
          <Activity size={14} className="text-zinc-500" />
          <span>{file.noteCount?.toLocaleString() || 0} Notes</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Layers size={14} className="text-zinc-500" />
          <span>{file.trackCount} Track{file.trackCount !== 1 ? 's' : ''} • {durationStr}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mt-1">
          <Clock size={12} className="text-zinc-600" />
          <span>Modified {formattedDate}</span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 relative z-10">
        <button
          onClick={() => onLoad(file)}
          className="col-span-2 py-2.5 rounded-xl bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/20 hover:border-purple-500 font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          title="Open in Editor"
        >
          <Edit3 size={16} /> Open Editor
        </button>
        <button
          onClick={() => onLoad(file)} 
          className="col-span-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center gap-2 text-zinc-300 hover:text-white transition-all border border-[#222]"
          title="Preview"
        >
          <Play size={14} className="fill-current" /> Preview
        </button>
        <button
          onClick={() => onExport(file)}
          className="col-span-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center gap-2 text-zinc-300 hover:text-white transition-all border border-[#222]"
          title="Export to .mid"
        >
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
