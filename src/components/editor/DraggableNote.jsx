import React, { memo } from 'react';

const DraggableNote = memo(function DraggableNote({
  note, colorClass, colorHex, pixelsPerSecond, ROW_HEIGHT, START_MIDI, END_MIDI, isSelected, isPlaying, onSelect
}) {
  const left = note.time * pixelsPerSecond;
  const width = note.duration * pixelsPerSecond;
  const top = (END_MIDI - note.midi) * ROW_HEIGHT;
  
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); onSelect(note.id, e.shiftKey || e.metaKey); }}
      className={`absolute rounded-sm border ${isSelected ? 'border-white z-10' : 'border-black/50 z-0'} ${colorClass}`}
      style={{
        left, width, top, height: ROW_HEIGHT, backgroundColor: colorHex,
        filter: isPlaying ? 'brightness(1.4) saturate(1.2)' : isSelected ? 'brightness(1.2)' : 'none',
        boxShadow: isPlaying ? `0 0 10px ${colorHex}` : 'none'
      }}
    />
  );
});

export default DraggableNote;
