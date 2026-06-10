import NoteBlock from "./NoteBlock";

export default function FallingNotes({ notes, currentTime, PIXELS_PER_SECOND }) {
  return (
    <div className="relative h-[400px] overflow-hidden w-full bg-zinc-900 border-x border-t border-zinc-800 rounded-t-xl">
      {notes.map((note) => (
        <NoteBlock
          key={note.id}
          note={note}
          currentTime={currentTime}
          PIXELS_PER_SECOND={PIXELS_PER_SECOND}
        />
      ))}
    </div>
  );
}
