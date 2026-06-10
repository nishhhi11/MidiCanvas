import { getNotePosition } from "./keyMap";

export default function NoteBlock({ note, currentTime, PIXELS_PER_SECOND }) {
  // Distance from hit line = (startTime - currentTime) * speed
  const bottom = (note.startTime - currentTime) * PIXELS_PER_SECOND;
  const height = note.duration * PIXELS_PER_SECOND;

  const position = getNotePosition(note.note);
  
  // Hide notes entirely out of our bound
  if (!position) return null; 

  // Don't render notes that have completely fallen off the screen to save memory
  if (bottom < -height) return null;

  const isBlack = position.type === "black";

  return (
    <div
      className={`absolute rounded-md shadow-lg ${isBlack ? 'bg-orange-700 z-10' : 'bg-orange-500'}`}
      style={{
        bottom: `${bottom}px`,
        left: `${position.left}%`,
        width: `${position.width}%`,
        height: `${height}px`,
      }}
    />
  );
}
