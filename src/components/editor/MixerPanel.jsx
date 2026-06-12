/**
 * MixerPanel.jsx
 * Track inspector: mute / solo / volume / color picker per track.
 */
import { Settings } from 'lucide-react';
import { getTrackColor } from '../../utils/colors';

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
      <h2 className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
        <Settings size={14} /> Tracks Found
      </h2>
      <div className="space-y-4">
        {tracks.length > 0 ? tracks.map((track) => (
          <div key={track.id} className="bg-black/30 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
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
                <span className="font-bold text-sm text-white truncate max-w-[120px]" title={track.name}>
                  {track.name}
                </span>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{track.noteCount} notes</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleMute(track.id)}
                className={`flex-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  mutedTracks.has(track.id)
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => toggleSolo(track.id)}
                className={`flex-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  soloedTracks.has(track.id)
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                Solo
              </button>
            </div>

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
          <p className="text-zinc-500 text-sm">Upload a MIDI file to extract tracks.</p>
        )}
      </div>
    </div>
  );
}
