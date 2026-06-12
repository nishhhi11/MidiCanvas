import React, { useRef, useState, useEffect } from 'react';
import { useMidiStore } from '../../stores/midiStore';

export default function VelocityLane({ rawNotes, duration, pixelsPerSecond, onNoteUpdate, selectedNoteIds }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e, noteId) => {
    e.stopPropagation();
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);

    if (selectedNoteIds && !selectedNoteIds.has(noteId) && window.setSelectedNoteIds) {
      window.setSelectedNoteIds(new Set([noteId]));
    }
  };

  const handlePointerMove = (e, noteId) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    let newVelocity = 1 - (y / rect.height);
    newVelocity = Math.max(0, Math.min(newVelocity, 1));

    onNoteUpdate(noteId, { velocity: newVelocity });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="h-24 bg-[#111] border-t border-[#333] relative flex-shrink-0 flex group" ref={containerRef}>

      <div className="absolute top-1 left-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest pointer-events-none z-10">
        Velocity
      </div>

      <div className="relative w-full h-full overflow-hidden">
        {rawNotes.map(note => {
          const isSelected = selectedNoteIds && selectedNoteIds.has(note.id);
          const left = note.time * pixelsPerSecond;
          const height = (note.velocity || 0.7) * 100;

          return (
            <div
              key={`vel-${note.id}`}
              className="absolute bottom-0 w-2 ml-[-4px] cursor-ns-resize"
              style={{ left, height: `${height}%` }}
              onPointerDown={(e) => handlePointerDown(e, note.id)}
              onPointerMove={(e) => handlePointerMove(e, note.id)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className={`w-1 mx-auto h-full rounded-t-sm transition-colors
                ${isSelected ? 'bg-white shadow-[0_0_10px_#ffffff]' : 'bg-white/60 hover:bg-white/80'}`} 
              />
              <div className={`w-2 h-2 rounded-full absolute -top-1 left-0 transition-colors
                ${isSelected ? 'bg-white shadow-[0_0_10px_#ffffff]' : 'bg-zinc-400 hover:bg-zinc-300'}`} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
