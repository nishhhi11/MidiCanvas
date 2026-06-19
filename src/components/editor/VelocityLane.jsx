import React, { useRef, useState, useEffect } from 'react';
import { useMidiStore } from '../../stores/midiStore';

/*
PURPOSE:
Renders a UI lane below the Piano Roll where users can click and drag to adjust the velocity (volume) of individual notes.

REACT CONCEPT:
Interactive UI Component with DOM ref calculations.
*/
export default function VelocityLane({ rawNotes, duration, pixelsPerSecond, onNoteUpdate, selectedNoteIds }) {
  const containerRef = useRef(null);
  
  // Tracks if the user is currently dragging a velocity stem
  const [isDragging, setIsDragging] = useState(false);

  /*
  PURPOSE:
  Triggers when the user clicks down on a velocity stem.

  VIVA QUESTION:
  Why do you use `e.target.setPointerCapture`?

  VIVA ANSWER:
  When dragging to change velocity, the user's mouse might accidentally slip off the thin 2-pixel wide stem. If that happens without pointer capture, the mouse events stop firing, and the dragging gets "stuck". `setPointerCapture` locks all mouse events to that specific DOM element until we release it, ensuring smooth dragging even if the cursor leaves the element visually.
  */
  const handlePointerDown = (e, noteId) => {
    e.stopPropagation(); // Prevents the Piano Roll background from registering a click
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);

    // If the note isn't already selected, select it
    if (selectedNoteIds && !selectedNoteIds.has(noteId) && window.setSelectedNoteIds) {
      window.setSelectedNoteIds(new Set([noteId]));
    }
  };

  /*
  PURPOSE:
  Fires continuously as the mouse moves up and down. Calculates the new velocity (0.0 to 1.0).
  */
  const handlePointerMove = (e, noteId) => {
    if (!isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Y is inverted (0 is top, max is bottom). Velocity 1 is top, 0 is bottom.
    let newVelocity = 1 - (y / rect.height);
    newVelocity = Math.max(0, Math.min(newVelocity, 1)); // Clamp between 0 and 1

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
        {/*
        PURPOSE:
        Maps over all notes and draws a vertical line (stem) whose height corresponds to the note's velocity.
        */}
        {rawNotes.map(note => {
          const isSelected = selectedNoteIds && selectedNoteIds.has(note.id);
          const left = note.time * pixelsPerSecond;
          
          // Multiply by 100 to get a CSS percentage for height
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
              {/* The visual line */}
              <div className={`w-1 mx-auto h-full rounded-t-sm transition-colors
                ${isSelected ? 'bg-white shadow-[0_0_10px_#ffffff]' : 'bg-white/60 hover:bg-white/80'}`} 
              />
              {/* The circle "handle" at the top */}
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
Renders a horizontal UI lane that visualizes note velocities (how hard a note is struck) as vertical bars. Allows the user to click and drag the bars up/down to modify the velocity of specific notes.

Data Flow:
User drags bar -> `handlePointerMove` calculates Y relative to container -> Dispatches `onNoteUpdate` callback -> Zustand store updates `note.velocity` -> Re-renders bar with new height.

React Concepts Used:
- Controlled components via prop drilling (receiving `onNoteUpdate`).
- `useRef` to get container dimensions for math calculations.

JavaScript/Browser Concepts Used:
- `setPointerCapture` for robust dragging mechanics.
- `getBoundingClientRect()` to calculate coordinates relative to the DOM element, not the whole screen.

Most Likely Viva Questions:
1. How does the dragging math work to change velocity?

Expected Answers:
1. `getBoundingClientRect()` gives the Y-coordinate of the mouse relative to the top of the container. We divide that Y-coordinate by the total height of the container to get a decimal (e.g., 0.25 means the mouse is 25% down from the top). Since higher velocities should be at the top visually, we subtract that value from 1 (so 25% down becomes 0.75 velocity). We use `Math.max` and `Math.min` to ensure the value is clamped exactly between 0 and 1.
*/
