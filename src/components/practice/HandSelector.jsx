import { useMidiStore } from "../../store/midiStore";

export default function HandSelector() {
  const { activeHand, setActiveHand } = useMidiStore();

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
      <p className="font-semibold text-lg">🤲 Hand Isolation</p>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveHand("left")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            activeHand === "left" ? "bg-orange-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
          }`}
        >
          Left
        </button>
        <button 
          onClick={() => setActiveHand("both")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            activeHand === "both" ? "bg-orange-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
          }`}
        >
          Both
        </button>
        <button 
          onClick={() => setActiveHand("right")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            activeHand === "right" ? "bg-orange-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
          }`}
        >
          Right
        </button>
      </div>
    </div>
  );
}
