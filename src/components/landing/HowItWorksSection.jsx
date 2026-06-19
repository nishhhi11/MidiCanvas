import React, { useState, useEffect } from "react";
import { FolderUp, FileSearch, Edit3, PlayCircle } from "lucide-react";

/*
PURPOSE:
An animated stepper on the landing page explaining the core user journey (Upload -> Parse -> Edit -> Play).

REACT CONCEPT:
Component state management paired with a timer-based effect.
*/
export default function HowItWorksSection() {
    const steps = [
        {
            icon: FolderUp,
            title: "UPLOAD",
            desc: "Drag any Standard MIDI File (.mid) from your computer"
        },
        {
            icon: FileSearch,
            title: "PARSE",
            desc: "Engine decodes binary → note array with pitch, timing, velocity"
        },
        {
            icon: Edit3,
            title: "EDIT",
            desc: "Click, drag, stretch, or delete notes. Snap to grid."
        },
        {
            icon: PlayCircle,
            title: "PLAYBACK",
            desc: "Hear your edits instantly via Web Audio synthesis"
        }
    ];

    const [activeStep, setActiveStep] = useState(0);

    /*
    VIVA QUESTION:
    Why do you need to return `clearInterval(timer)` in the useEffect?

    VIVA ANSWER:
    `setInterval` registers a repeating task with the browser's event loop. If the user navigates away from the landing page, the component unmounts, but the interval will keep firing forever in the background, trying to update state on a non-existent component (a memory leak). Returning `clearInterval` acts as a cleanup function that React guarantees to run right before unmounting.
    */
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [steps.length]);

    return (
        <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
            <h2 className="text-2xl font-bold text-white text-center mb-24 tracking-wider">HOW IT WORKS</h2>

            <div className="relative max-w-5xl mx-auto">

                {/* Background line for the progress bar */}
                <div className="absolute top-12 left-[12%] right-[12%] h-1 bg-white/5 rounded-full hidden sm:block" />

                {/* Animated progress bar fill */}
                <div 
                    className="absolute top-12 left-[12%] h-1 bg-white transition-all duration-700 ease-out rounded-full hidden sm:block shadow-[0_0_15px_rgba(255,255,255,0.6)]" 
                    style={{ width: `${(activeStep / (steps.length - 1)) * 76}%` }}
                />

                <div className="flex flex-col sm:flex-row items-start justify-between gap-8 relative z-10">
                    {steps.map((step, i) => {
                        const isActive = i <= activeStep;
                        const isCurrent = i === activeStep;
                        const Icon = step.icon;

                        return (
                            <div 
                                key={i} 
                                className="flex-1 flex flex-col items-center text-center group cursor-pointer" 
                                onMouseEnter={() => setActiveStep(i)}
                            >

                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 relative
                                    ${isActive ? 'bg-white/10 border border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-105' : 'bg-white/5 border border-transparent grayscale opacity-40'}`}
                                >
                                    <Icon size={40} className={`transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-500'}`} strokeWidth={1.5} />

                                    {/* Pulsing ring around the currently active step */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping opacity-20" />
                                    )}
                                </div>

                                {/* Node dots on the progress line */}
                                <div className="mb-6 hidden sm:flex items-center justify-center">
                                    <div className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center
                                        ${isActive ? 'bg-white shadow-[0_0_15px_white]' : 'bg-[#111] border-2 border-zinc-700'}`} 
                                    >
                                        {isActive && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                </div>

                                <h3 className={`text-base font-bold tracking-wider mb-3 transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-600'}`}>{step.title}</h3>
                                <p className={`text-xs leading-relaxed transition-colors duration-500 max-w-[200px] mx-auto ${isActive ? 'text-zinc-400' : 'text-zinc-700'}`}>{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Landing page stepper indicating the pipeline a MIDI file goes through.

React Concepts Used:
- Setting intervals inside `useEffect` with proper cleanup.
- Computing dynamic CSS (progress bar width based on state).
*/