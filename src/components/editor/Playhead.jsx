import React, { useEffect } from 'react';
import { usePlaybackStore } from '../../stores/playbackStore';

/*
PURPOSE:
Renders the vertical red line (playhead) that moves across the Piano Roll to indicate the current playback position. It also auto-scrolls the container to keep the playhead in view.

REACT CONCEPT:
Component subscribing to a highly-frequent global state update.
*/
export default function Playhead({ pixelsPerSecond, containerRef }) {
  /*
  VIVA QUESTION:
  Why do you only select `currentTime` from the `usePlaybackStore` instead of the whole state object?

  VIVA ANSWER:
  Because `currentTime` updates 60 times a second (via `requestAnimationFrame`). If I grabbed the whole state object, any time *any* property in the store changed, this component would re-render. By using a selector `state => state.currentTime`, Zustand ensures this component *only* re-renders when `currentTime` changes, maximizing performance.
  */
  const currentTime = usePlaybackStore(state => state.currentTime);

  /*
  PURPOSE:
  Auto-scrolls the piano roll canvas if the playhead moves out of view.
  
  REACT CONCEPT:
  `useEffect` for DOM manipulation based on state changes.
  */
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate exact pixel position of the playhead
    const playheadPos = currentTime * pixelsPerSecond;

    // This is a naive auto-scroll that forces the scrollbar to match the playhead exactly.
    // (In a more advanced version, we'd only scroll if the playhead reached the edge of the screen).
    containerRef.current.scrollLeft = playheadPos;
  }, [currentTime, pixelsPerSecond, containerRef]);

  return (
    <div
      className="absolute top-0 h-full w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_12px_rgba(255,68,68,0.6)]"
      style={{ 
        // Drives the physical movement of the red line across the screen
        left: currentTime * pixelsPerSecond,
      }}
    />
  );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Renders the animated red playhead line and handles auto-scrolling the piano roll view.

Data Flow:
Audio Engine -> Zustand `currentTime` -> Component Re-renders -> Updates `style.left` & triggers `useEffect` to scroll container.

React Concepts Used:
- Zustand selective state subscriptions.
- `useEffect` for imperative DOM interactions (`scrollLeft`).
- Inline styling for high-frequency coordinate updates.

Most Likely Viva Questions:
1. Since this component updates 60 times a second, why doesn't it lag the whole application?

Expected Answers:
1. React's virtual DOM is very fast at updating a single `div`'s inline `left` style. Crucially, because the Playhead is its own isolated component, its 60fps re-renders are contained *only* within this tiny component. The massive Piano Roll Canvas behind it, with thousands of note components, does *not* re-render because it does not subscribe to `currentTime`.
*/
