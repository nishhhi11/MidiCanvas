import { useEffect } from "react";
import { useMidiStore } from "../../store/midiStore";
import { setPlaybackSpeed } from "../../services/playbackEngine";
import { startMetronome, stopMetronome, initializeMetronome } from "../../services/metronomeService";

export default function TempoControls() {
  const { learningConfig, setLearningConfig, tempoConfig, setTempoConfig, midiData, isPlaying } = useMidiStore();

  useEffect(() => {
    initializeMetronome();
  }, []);

  // Sync metronome with playback
  useEffect(() => {
    if (tempoConfig.metronome && isPlaying && midiData?.tempo) {
      startMetronome(midiData.tempo * learningConfig.speed);
    } else {
      stopMetronome();
    }
  }, [tempoConfig.metronome, isPlaying, midiData, learningConfig.speed]);

  const handleSpeedChange = (speed) => {
    setLearningConfig({ speed });
    setPlaybackSpeed(speed);
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg flex items-center gap-2">⏱️ Tempo</p>
        <span className="font-bold text-orange-500">{(learningConfig.speed * 100).toFixed(0)}%</span>
      </div>
      
      <input 
        type="range" 
        min="0.5" 
        max="1.25" 
        step="0.05" 
        value={learningConfig.speed} 
        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500"
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer flex-1 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition border border-zinc-700">
          <input 
            type="checkbox" 
            checked={tempoConfig.metronome}
            onChange={(e) => setTempoConfig({ metronome: e.target.checked })}
            className="accent-orange-500"
          />
          <span className="text-sm font-semibold">Metronome</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer flex-1 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition border border-zinc-700">
          <input 
            type="checkbox" 
            checked={tempoConfig.adaptive}
            onChange={(e) => setTempoConfig({ adaptive: e.target.checked })}
            className="accent-orange-500"
          />
          <span className="text-sm font-semibold">Adaptive</span>
        </label>
      </div>
    </div>
  );
}
