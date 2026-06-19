/*
PURPOSE:
Renders a single White Key on the virtual keyboard UI.

REACT CONCEPT:
Dumb/Presentational Component.

VIVA QUESTION:
Why do you handle `onMouseLeave` by calling `onMouseUp`?

VIVA ANSWER:
If a user clicks a key down (`onMouseDown`), the note starts playing. If they drag their mouse completely off the key and release the click somewhere else, the key never registers an `onMouseUp` event, so the note plays infinitely (a stuck note). Tying `onMouseLeave` to `onMouseUp` prevents this bug by stopping the note as soon as the cursor leaves the element.
*/
export default function WhiteKey({ note, left, width, isActive, onMouseDown, onMouseUp }) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp} // Prevents stuck notes
      className={`absolute bottom-0 h-full border-r border-zinc-400 flex items-end justify-center pb-2 font-semibold transition-all select-none cursor-pointer rounded-b-md ${
        isActive 
          ? "bg-orange-500 text-black translate-y-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]" 
          : "bg-white text-black"
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="pointer-events-none text-[10px]">{note}</span>
    </div>
  );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A simple UI component for a white piano key.

React Concepts Used:
- Props for dimensions, state, and event callbacks.
*/
