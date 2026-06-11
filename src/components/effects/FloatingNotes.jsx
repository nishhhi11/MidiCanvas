import { useEffect, useState } from "react";

export default function FloatingNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setNotes((prev) => [
        ...prev,
        {
          id,
          left: Math.random() * 100,
          animationDuration: 5 + Math.random() * 5,
          opacity: 0.1 + Math.random() * 0.3,
          fontSize: 1 + Math.random() * 2,
        },
      ]);

      // Remove after animation
      setTimeout(() => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      }, 10000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute bottom-0 text-purple-500/30"
          style={{
            left: `${note.left}%`,
            opacity: note.opacity,
            fontSize: `${note.fontSize}rem`,
            animation: `float ${note.animationDuration}s linear forwards`,
          }}
        >
          ♪
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100%) rotate(0deg);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
