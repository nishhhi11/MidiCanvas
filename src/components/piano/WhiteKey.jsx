export default function WhiteKey({ note, left, width, isActive, onMouseDown, onMouseUp }) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className={`absolute bottom-0 h-full border-r border-zinc-400 flex items-end justify-center pb-2 font-semibold transition-all select-none cursor-pointer rounded-b-md ${
        isActive 
          ? "bg-orange-500 text-black translate-y-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]" 
          : "bg-white text-black"
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="pointer-events-none text-xs">{note}</span>
    </div>
  );
}
