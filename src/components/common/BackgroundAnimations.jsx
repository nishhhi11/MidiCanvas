import React from 'react';

export const BackgroundAnimations = () => {
    const notes = ["🎵", "🎶", "🎼", "🎹", "♭", "♯"];
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 15 }).map((_, i) => {
                const note = notes[Math.floor(Math.random() * notes.length)];
                const left = `${Math.random() * 100}%`;
                const delay = `${Math.random() * 15}s`;
                const duration = `${15 + Math.random() * 20}s`;
                const driftX = `${(Math.random() - 0.5) * 200}px`;
                const size = `${Math.random() * 2 + 1}rem`;

                return (
                    <div 
                        key={i}
                        className="absolute bottom-0 text-white opacity-0"
                        style={{
                            left,
                            fontSize: size,
                            animation: `music-drift ${duration} linear ${delay} infinite`,
                            "--drift-x": driftX
                        }}
                    >
                        {note}
                    </div>
                );
            })}
        </div>
    );
};
