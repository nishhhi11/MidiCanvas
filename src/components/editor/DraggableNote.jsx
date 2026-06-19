import React, { memo, useState } from 'react';

/*
PURPOSE:
Renders a single MIDI note on the Piano Roll. It handles pointer events (mouse/touch) for moving the note, resizing its left/right edges, and double-clicking to delete.

REACT CONCEPT:
`React.memo` for extreme performance optimization.

VIVA QUESTION:
Why is this component wrapped in `React.memo`?

VIVA ANSWER:
The Piano Roll might render thousands of these note components simultaneously. During playback, the global `currentTime` changes 60 times a second. If the parent `PianoRollCanvas` re-renders, it would normally force all thousand notes to re-render, causing massive lag. `React.memo` tells React to skip re-rendering this component unless its specific props (like `isSelected` or `isPlaying`) have changed.
*/
const DraggableNote = memo(function DraggableNote({
  note, colorClass, colorHex, pixelsPerSecond, ROW_HEIGHT, START_MIDI, END_MIDI, isSelected, isPlaying, onSelect, onUpdate, onDelete
}) {
  // Local state tracking the current drag action (move, resize-left, resize-right)
  const [dragState, setDragState] = useState(null);
  
  // Base visual coordinates calculated from MIDI data
  const baseLeft = note.time * pixelsPerSecond;
  const baseWidth = note.duration * pixelsPerSecond;
  const baseTop = (END_MIDI - note.midi) * ROW_HEIGHT;

  // Variables we'll mutate if a drag is currently happening
  let left = baseLeft;
  let width = baseWidth;
  let top = baseTop;

  /*
  PURPOSE:
  Optimistically updates the visual position of the note while dragging, BEFORE sending the final update to the global Zustand store.
  */
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

  /*
  PURPOSE:
  Fires when the user clicks down on the note or its resize handles.

  VIVA QUESTION:
  Why do you use `e.target.setPointerCapture`?

  VIVA ANSWER:
  When dragging a small element quickly, the user's mouse cursor might accidentally move off the element. If that happens, the element stops receiving `pointermove` events, and the drag stops unexpectedly. `setPointerCapture(pointerId)` forces all subsequent mouse events to be routed to this specific element, even if the cursor leaves its physical boundaries, until we release the capture on `pointerup`.
  */
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

  /*
  PURPOSE:
  Fires when the user releases the mouse. Calculates the final new time/duration/pitch and sends it to the parent.
  */
  const handlePointerUp = (e) => {
    if (!dragState) return;
    e.target.releasePointerCapture(dragState.pointerId);
    
    // Only update if they actually moved it (not just a click)
    if (onUpdate && (dragState.deltaX !== 0 || dragState.deltaY !== 0)) {
      let newTime = note.time;
      let newDuration = note.duration;
      let newMidi = note.midi;

      // Convert pixel deltas back into musical time/pitch values
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
      {/* Left Resize Handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30"
        onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
      />
      
      {/* Right Resize Handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30"
        onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
      />

      {/* Note Name Label (hidden if note is too narrow) */}
      {width > 25 && (
        <span className="text-[9px] font-bold text-black/60 pointer-events-none truncate z-0">
          {note.name.replace('#', '♯')}
        </span>
      )}
    </div>
  );
});

export default DraggableNote;

/*
========================================
FILE SUMMARY
========================================

Purpose:
The interactive visual representation of a single MIDI event. Handles its own drag-and-drop mechanics before committing changes to the global state.

Data Flow:
Props (time/duration) -> Base Pixels -> Drag Occurs -> Mutate Local Pixels -> Pointer Up -> Math conversion back to time/duration -> `onUpdate` callback -> Zustand State -> Re-render Props.

React Concepts Used:
- `React.memo` to prevent re-renders when parent state changes.
- Local component state (`useState`) for drag mechanics.
- Optimistic UI updates.

Browser APIs Used:
- Pointer Events API (`onPointerDown`, `onPointerMove`, `onPointerUp`).
- Pointer Capture (`setPointerCapture`, `releasePointerCapture`) to maintain lock during fast drags.

Most Likely Viva Questions:
1. Explain the math behind converting an X-pixel coordinate into a musical time value.

Expected Answers:
1. The canvas relies on a `pixelsPerSecond` zoom ratio. If a note is moved by 100 pixels (`deltaX`), and our zoom is 50 `pixelsPerSecond`, we divide `100 / 50` to get `2`. We then add 2 seconds to the note's original start `time`. For pitch (Y-axis), we divide `deltaY` by the constant `ROW_HEIGHT` to find how many semi-tones the note shifted up or down.
*/
