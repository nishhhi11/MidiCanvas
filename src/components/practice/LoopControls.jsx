import { useMidiStore } from "../../store/midiStore";

export default function LoopControls() {
  const { loopConfig, setLoopConfig, currentTime } = useMidiStore();

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">🔁 A-B Looping</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={loopConfig.enabled}
            onChange={(e) => setLoopConfig({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setLoopConfig({ start: currentTime, enabled: true })}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg py-2 font-bold transition"
        >
          [ Set A ] {loopConfig.start > 0 ? `(${loopConfig.start.toFixed(1)}s)` : ""}
        </button>
        <button 
          onClick={() => setLoopConfig({ end: currentTime, enabled: true })}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg py-2 font-bold transition"
        >
          [ Set B ] {loopConfig.end > 0 ? `(${loopConfig.end.toFixed(1)}s)` : ""}
        </button>
      </div>
      {loopConfig.enabled && loopConfig.end > 0 && loopConfig.start >= loopConfig.end && (
         <p className="text-red-400 text-xs">A must be before B.</p>
      )}
    </div>
  );
}
