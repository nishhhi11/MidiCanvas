import React, { useState, useEffect } from 'react';
import { Activity, Clock, FileAudio } from 'lucide-react';

export default function TelemetryOverlay({ totalNotes, activeVoices }) {
  const [pointerTime, setPointerTime] = useState(0);

  useEffect(() => {
    const handlePointerMove = (e) => {
      setPointerTime(e.detail.time);
    };
    window.addEventListener('piano-pointer-move', handlePointerMove);
    return () => window.removeEventListener('piano-pointer-move', handlePointerMove);
  }, []);

  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <div className="h-6 bg-[#0a0a0a] border-t border-[#222] flex items-center justify-between px-4 text-[10px] font-mono text-zinc-500 z-50 shrink-0 select-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5" title="Total Note Count">
          <FileAudio size={12} className="text-zinc-600" />
          <span>{totalNotes.toLocaleString()} NOTES</span>
        </div>
        <div className="flex items-center gap-1.5" title="Active Voice Count">
          <Activity size={12} className={activeVoices > 0 ? "text-white" : "text-zinc-600"} />
          <span className={activeVoices > 0 ? "text-zinc-300" : ""}>{activeVoices} VOICES</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5" title="Pointer Time Coordinate">
        <Clock size={12} className="text-zinc-600" />
        <span>CURSOR: {formatTime(pointerTime)}</span>
      </div>
    </div>
  );
}
