/*
PURPOSE:
Renders a single Black Key on the virtual keyboard UI.

REACT CONCEPT:
Dumb/Presentational Component relying entirely on props.

VIVA QUESTION:
Why is `z-10` important here?

VIVA ANSWER:
Black keys physically sit "on top" of white keys. In CSS, the z-index controls the stacking order along the Z-axis. Giving the black key `z-10` ensures it renders above the white keys, which have default z-indexes.
*/
export default function BlackKey({ note, left, width, isActive, onMouseDown, onMouseUp }) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className={`absolute top-0 h-[65%] border-x border-b border-black flex items-end justify-center pb-2 font-semibold transition-all select-none cursor-pointer rounded-b-sm z-10 ${
        isActive 
          ? "bg-orange-600 text-white translate-y-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]" 
          : "bg-zinc-900 text-zinc-400"
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
A simple UI component for a black piano key.

React Concepts Used:
- Props for styling (`left`, `width`, `isActive`) and event handling (`onMouseDown`, `onMouseUp`).
- Conditional classNames for active/pressed styling.
*/
