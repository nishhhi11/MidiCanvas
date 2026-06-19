
import { Settings } from 'lucide-react';
import { getTrackColor } from '../../utils/colors';

/*
PURPOSE:
A UI component that displays all tracks parsed from the MIDI file, allowing the user to mute, solo, change volume, and change the color of each track independently.

REACT CONCEPT:
Component receiving state and dispatch functions as props (Lifting State Up / Prop Passing).
*/
export default function MixerPanel({
  tracks = [],
  mutedTracks,
  soloedTracks,
  trackVolumes,
  trackColors,
  toggleMute,
  toggleSolo,
  setTrackVolume,
  setTrackColor,
}) {
  return (
    <div className="xl:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl overflow-y-auto">
      <h2 className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
        <Settings size={14} /> Tracks Found
      </h2>
      <div className="space-y-4">
        {tracks.length > 0 ? tracks.map((track) => (
          <div key={track.id} className="bg-black/30 border border-white/5 rounded-xl p-4">
            
            {/* 
            PURPOSE: Track Header (Color Picker and Name) 
            */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                
                {/* 
                PURPOSE: Custom Color Picker UI 
                VIVA QUESTION: How did you style the standard HTML `<input type="color">` which is notoriously difficult to style?
                VIVA ANSWER: By wrapping it in a relatively positioned `div` with a border radius. I set the actual `<input>` to absolute positioning, scaled it up (`w-[200%] h-[200%]`) so it overflows the container, and set `opacity-0` so it's invisible but still clickable. Then, I placed a colored `div` underneath it (`pointer-events-none`) to act as the visual representation.
                */}
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={trackColors[track.id] || getTrackColor(track.id)}
                    onChange={(e) => setTrackColor(track.id, e.target.value)}
                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer opacity-0"
                    title="Change Track Color"
                  />
                  <div
                    className="w-full h-full pointer-events-none"
                    style={{ backgroundColor: trackColors[track.id] || getTrackColor(track.id) }}
                  />
                </div>
                <span className="font-bold text-xs text-white truncate max-w-[120px]" title={track.name}>
                  {track.name}
                </span>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono">{track.noteCount} notes</span>
            </div>

            {/* 
            PURPOSE: Mute and Solo Buttons 
            */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleMute(track.id)}
                className={`flex-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  mutedTracks.has(track.id)
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => toggleSolo(track.id)}
                className={`flex-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  soloedTracks.has(track.id)
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Solo
              </button>
            </div>

            {/* 
            PURPOSE: Volume Slider 
            */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Vol</span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={trackVolumes[track.id] !== undefined ? trackVolumes[track.id] : 1.0}
                onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                className="flex-1 accent-purple-500 bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-zinc-500 w-6 text-right">
                {Math.round((trackVolumes[track.id] !== undefined ? trackVolumes[track.id] : 1.0) * 100)}%
              </span>
            </div>
          </div>
        )) : (
          <p className="text-zinc-500 text-xs">Upload a MIDI file to extract tracks.</p>
        )}
      </div>
    </div>
  );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A UI component rendering the track list and mixer controls (volume, mute, solo, color).

Data Flow:
User clicks Mute -> Calls `toggleMute(trackId)` prop -> Updates `useMixerStore` -> Audio Engine reads new store state and stops scheduling notes for that track.

React Concepts Used:
- Conditional rendering (`tracks.length > 0 ? ... : ...`).
- List rendering (`tracks.map(...)`). Every item mapped from an array must have a unique `key` prop so React can efficiently update the DOM without re-rendering the whole list.

JavaScript Concepts Used:
- Destructuring assignment in component arguments.

Most Likely Viva Questions:
1. Why do you pass `toggleMute` as a prop instead of importing `useMixerStore` directly inside this component?

Expected Answers:
1. "Separation of Concerns" and testing. By passing the state and functions as props, `MixerPanel` becomes a "dumb" or "pure" component. It doesn't know where the data comes from. This makes it highly reusable (we could reuse this UI in another part of the app) and easier to test without needing to mock the Zustand store. The parent component handles the logic and passes it down.
*/
