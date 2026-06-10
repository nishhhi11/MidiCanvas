export default function PianoKeyboard({ currentNote, nextNote }) {
    const whiteKeys = [
        "C4", "D4", "E4", "F4", "G4", "A4", "B4",
        "C5", "D5", "E5", "F5", "G5", "A5", "B5"
    ];

    return (
        <div className="flex h-32 rounded-xl overflow-hidden border border-zinc-800">
            {whiteKeys.map((key, index) => {
                const isCurrent = currentNote && currentNote.name === key;
                const isNext = nextNote && nextNote.name === key;
                
                let bgClass = "bg-white text-black";
                if (isCurrent) bgClass = "bg-orange-500 text-black";
                else if (isNext) bgClass = "bg-orange-200 text-black";

                return (
                    <div
                        key={index}
                        className={`flex-1 border-r border-zinc-400 flex items-end justify-center pb-2 font-semibold transition-colors ${bgClass}`}
                    >
                        {key}
                    </div>
                );
            })}
        </div>
    );
}