import React from 'react';

/*
PURPOSE:
Renders a decorative background with musical notes drifting slowly across the screen.

REACT CONCEPT:
Pure functional component rendering a static array of elements.

VIVA QUESTION:
Why is it acceptable to use `Math.random()` to generate the styles and content here, but generally considered bad practice in React rendering?

VIVA ANSWER:
Usually, using `Math.random()` during render causes UI inconsistencies across re-renders (Hydration errors in SSR, or jumpy UI when state changes). However, this component is purely decorative, takes no props, and has no state. It renders exactly once on mount. The `pointer-events-none` ensures it never receives user interaction that could trigger a re-render.
*/
export const BackgroundAnimations = () => {
    const notes = ["🎵", "🎶", "🎼", "🎹", "♭", "♯"];
    
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Creates an array of 8 undefined elements to map over for generating 8 background notes */}
            {Array.from({ length: 8 }).map((_, i) => {
                const note = notes[Math.floor(Math.random() * notes.length)];
                const left = `${Math.random() * 100}%`;
                const delay = `-${Math.random() * 15}s`;
                const duration = `${15 + Math.random() * 20}s`;
                const driftX = `${(Math.random() - 0.5) * 200}px`;
                const size = `3rem`;

                return (
                    <div 
                        key={i}
                        className="absolute bottom-0 text-[var(--text-main)] opacity-0"
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
A visual component that generates animated musical notes floating upwards in the background.

React Concepts Used:
- Functional Component.
- Inline styling for dynamic, randomized CSS properties.
- Using array mapping to generate multiple DOM nodes (`Array.from({length: 8}).map(...)`).

Most Likely Viva Questions:
1. What does `pointer-events-none` do here?

Expected Answers:
1. It is a CSS utility class that tells the browser to ignore all mouse events on this div. If we didn't have this, the invisible floating notes might accidentally block the user from clicking buttons on the main UI underneath them.
*/
