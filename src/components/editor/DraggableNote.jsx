import React, { memo, useState } from 'react';

const DraggableNote = memo(function DraggableNote({
  note, colorClass, colorHex, pixelsPerSecond, ROW_HEIGHT, START_MIDI, END_MIDI, isSelected, isPlaying, onSelect, onUpdate, onDelete
}) {
  const [dragState, setDragState] = useState(null);
  
  const baseLeft = note.time * pixelsPerSecond;
  const baseWidth = note.duration * pixelsPerSecond;
  const baseTop = (END_MIDI - note.midi) * ROW_HEIGHT;

  let left = baseLeft;
  let width = baseWidth;
  let top = baseTop;

  if (dragState) {
    if (dragState.type === 'move') {
      left = baseLeft + dragState.deltaX;
      top = baseTop + dragState.deltaY;
    } else if (dragState.type === 'resize-right') {
      width = Math.max(10, baseWidth + dragState.deltaX);
    } else if (dragState.type === 'resize-left') {
      const newWidth = Math.max(10, baseWidth - dragState.deltaX);
      left = baseLeft + baseWidth - newWidth;
      width = newWidth;
    }
  }

  const handlePointerDown = (e, type) => {
    e.stopPropagation();
    onSelect(note.id, e.shiftKey || e.metaKey);
    e.target.setPointerCapture(e.pointerId);
    setDragState({
      type,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      deltaX: 0,
      deltaY: 0
    });
  };

  const handlePointerMove = (e) => {
    if (!dragState) return;
    setDragState(prev => ({
      ...prev,
      deltaX: e.clientX - prev.startX,
      deltaY: e.clientY - prev.startY
    }));
  };

  const handlePointerUp = (e) => {
    if (!dragState) return;
    e.target.releasePointerCapture(dragState.pointerId);
    
    if (onUpdate && (dragState.deltaX !== 0 || dragState.deltaY !== 0)) {
      let newTime = note.time;
      let newDuration = note.duration;
      let newMidi = note.midi;

      if (dragState.type === 'move') {
        newTime = Math.max(0, note.time + dragState.deltaX / pixelsPerSecond);
        const rowDelta = Math.round(dragState.deltaY / ROW_HEIGHT);
        newMidi = Math.max(START_MIDI, Math.min(END_MIDI, note.midi - rowDelta));
      } else if (dragState.type === 'resize-right') {
        newDuration = Math.max(0.1, note.duration + dragState.deltaX / pixelsPerSecond);
      } else if (dragState.type === 'resize-left') {
        const deltaT = dragState.deltaX / pixelsPerSecond;
        if (note.duration - deltaT > 0.1) {
          newTime = Math.max(0, note.time + deltaT);
          newDuration = note.duration - deltaT;
        }
      }

      onUpdate(note.id, { time: newTime, duration: newDuration, midi: newMidi });
    }
    setDragState(null);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(note.id);
  };

  return (
    <div
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={`absolute rounded-sm border transition-colors duration-150 ease-out flex items-center px-1 overflow-hidden group select-none
        ${isSelected ? 'border-white z-10 shadow-lg shadow-white/20 scale-[1.03]' : 'border-black/50 z-0 hover:scale-[1.01] hover:shadow-md'} 
        ${colorClass}
        ${dragState ? '!transition-none cursor-grabbing z-20 opacity-80' : 'cursor-pointer'}`}
      style={{
        left, width, top, height: ROW_HEIGHT, backgroundColor: colorHex,
        filter: isPlaying ? 'brightness(1.4) saturate(1.2)' : isSelected ? 'brightness(1.2)' : 'none',
        boxShadow: isPlaying ? `0 0 10px ${colorHex}` : 'none'
      }}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30"
        onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
      />
      
      <div 
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30"
        onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
      />

      {width > 25 && (
        <span className="text-[9px] font-bold text-black/60 pointer-events-none truncate z-0">
          {note.name.replace('#', '♯')}
        </span>
      )}
    </div>
  );
});

export default DraggableNote;

