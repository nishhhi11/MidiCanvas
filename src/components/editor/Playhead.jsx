import React, { useEffect } from 'react';
import { usePlaybackStore } from '../../stores/playbackStore';

export default function Playhead({ pixelsPerSecond, containerRef }) {
  const currentTime = usePlaybackStore(state => state.currentTime);

  useEffect(() => {
    if (!containerRef.current) return;
    const playheadPos = currentTime * pixelsPerSecond;
    // Continuously scroll the canvas so the playhead stays at the left edge (touching the keyboard)
    containerRef.current.scrollLeft = playheadPos;
  }, [currentTime, pixelsPerSecond, containerRef]);

  return (
    <div
      className="absolute top-0 h-full w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_12px_rgba(255,68,68,0.6)]"
      style={{ 
        left: currentTime * pixelsPerSecond,
        // Remove CSS transition so it doesn't fight with scrollLeft updates
      }}
    />
  );
}
