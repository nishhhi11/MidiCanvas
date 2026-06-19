import {  useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMidiParser } from "../../hooks/useMidiParser";
import { Music, MonitorPlay, Layers } from "lucide-react";

/*
PURPOSE:
The top section of the landing page. It provides the initial pitch, animations, and the primary entry point (a dropzone for MIDI files).

REACT CONCEPT:
Combining state (`useState`), effects (`useEffect`), and third-party hooks (`useDropzone`).
*/
export default function HeroSection() {
    const navigate = useNavigate();
    const { parse } = useMidiParser();
    const [particles, setParticles] = useState([]);

    /*
    PURPOSE:
    Generates random floating background particles.
    
    REACT CONCEPT:
    `useEffect` with an empty dependency array `[]` ensures this generation only runs once when the component mounts.
    */
    useEffect(() => {
        const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `-${Math.random() * 15}s`,
            opacity: Math.random() * 0.3 + 0.2
        }));
        setParticles(generatedParticles);
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            await parse(acceptedFiles[0]);
            navigate("/studio");
        }
    }, [parse, navigate]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'audio/midi': ['.mid', '.midi']
        },
        noClick: false
    });

    return (
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center relative overflow-hidden min-h-screen">

            {/* Background effects */}
            <div 
                className="absolute inset-0 z-0 animate-float-bg pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at top, rgba(128,128,128,0.06), transparent 50%)'
                }}
            />

            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {particles.map(p => (
                    <div 
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            top: p.top,
                            opacity: p.opacity,
                            animationDelay: p.animationDelay
                        }}
                    />
                ))}
            </div>

            {/* Floating Emojis */}
            <div className="absolute top-20 left-10 text-[120px] opacity-15 rotate-[-10deg] pointer-events-none z-0 select-none animate-[float_6s_ease-in-out_infinite]">🎹</div>
            <div className="absolute top-40 right-20 text-[150px] opacity-10 rotate-[15deg] pointer-events-none z-0 select-none animate-[float_8s_ease-in-out_infinite]">🎹</div>
            <div className="absolute bottom-40 left-1/4 text-[100px] opacity-20 rotate-[-20deg] pointer-events-none z-0 select-none animate-[float_7s_ease-in-out_infinite]">🎹</div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--text-main)] mb-6 leading-tight relative z-10 max-w-5xl">
                MIDI Canvas — Parse, Edit, and Learn Piano from Any MIDI File
            </h1>

            <p className="text-lg text-[var(--text-muted)] max-w-2xl mb-12 relative z-10 leading-relaxed">
                Turn any .mid file into an interactive piano lesson. Visualize notes, edit tracks, and practice at your own pace — entirely in your browser.
            </p>

            <div className="flex gap-4 mb-12 relative z-10">
                <button 
                    onClick={() => navigate("/studio")}
                    className="px-8 py-4 rounded-xl text-[var(--bg-primary)] bg-[var(--text-main)] text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden ivory-glow"
                >
                    <span className="relative z-10 flex items-center gap-2">🎹 Launch Interactive Workspace</span>
                </button>
            </div>

            {/* Drag and drop zone */}
            <div 
                {...getRootProps()} 
                className={`w-full max-w-2xl p-12 rounded-2xl cursor-pointer transition-all duration-300 relative z-10 group glass-panel
                    ${isDragActive ? 'scale-[1.03] border-2 border-[var(--primary)] bg-[var(--bg-secondary)] shadow-[0_0_80px_var(--primary)]' : 'border border-transparent hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3 transition-transform group-hover:-translate-y-1">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isDragActive ? 'bg-[var(--primary)]/20 scale-110 shadow-[0_0_30px_var(--primary)]' : 'bg-[var(--primary)]/5 group-hover:bg-[var(--primary)]/10 group-hover:shadow-[0_0_20px_var(--primary)]'}`}
                    >
                        <Music size={32} className={`transition-all duration-300 ${isDragActive ? 'text-[var(--text-main)] scale-110' : 'text-[var(--text-main)]/70 group-hover:scale-110'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] transition-all uppercase tracking-wide text-center">
                        {isDragActive ? "Release to Upload!" : (
                            <>
                                <span className="hidden md:inline">Drop MIDI File Here</span>
                                <span className="inline md:hidden">Tap to Select MIDI</span>
                            </>
                        )}
                    </h3>
                    <p className="text-[var(--text-muted)] text-base hidden md:block">or click to browse your computer</p>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-[10px] font-mono text-[var(--text-main)]/50 bg-[var(--text-main)]/5 px-3 py-1 rounded-full border border-[var(--text-main)]/5">
                            Supported format: .mid, .midi
                        </span>
                        <span className="text-xs italic text-[var(--text-main)]/40 mt-1">
                            Example: "Fur Elise.mid" or any song
                        </span>
                    </div>
                </div>
            </div>

            {/* Stylistic mini piano roll visual */}
            <div className="mt-8 mb-16 relative z-10 w-full max-w-2xl flex flex-col items-center opacity-90 select-none">
                <div className="w-full h-48 bg-[var(--bg-secondary)] rounded-t-xl border border-[var(--border)] relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 flex w-full h-full pointer-events-none opacity-20">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={`grid-${i}`} className="flex-1 border-r border-[var(--border)] last:border-r-0" />
                        ))}
                    </div>

                    {[
                        { col: 2, delay: 0, h: 40, color: 'bg-purple-500' },
                        { col: 4, delay: 0.5, h: 24, color: 'bg-blue-500' },
                        { col: 6, delay: 1, h: 48, color: 'bg-emerald-500' },
                        { col: 7, delay: 1.5, h: 32, color: 'bg-purple-500' },
                        { col: 9, delay: 2, h: 64, color: 'bg-blue-500' },
                        { col: 11, delay: 2.5, h: 24, color: 'bg-emerald-500' },
                        { col: 13, delay: 3, h: 40, color: 'bg-purple-500' },
                        { col: 4, delay: 3.5, h: 32, color: 'bg-blue-500' },
                        { col: 2, delay: 4, h: 48, color: 'bg-emerald-500' },
                    ].map((note, i) => (
                        <div 
                            key={`note-${i}`}
                            className={`absolute bottom-full w-[calc(100%/14)] ${note.color} rounded-sm shadow-[0_0_12px_currentColor] animate-fall`}
                            style={{
                                left: `${(note.col / 14) * 100}%`,
                                height: `${note.h}px`,
                                animationDuration: '4s',
                                animationTimingFunction: 'linear',
                                animationIterationCount: 'infinite',
                                animationDelay: `${note.delay}s`,
                                opacity: 0.9
                            }}
                        />
                    ))}

                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent pointer-events-none" />
                </div>

                <div className="w-full h-1 bg-zinc-800 border-t border-[var(--border)]" />
                <div className="flex w-full h-14 bg-white rounded-b-xl overflow-hidden border border-[var(--border)] shadow-[0_20px_40px_rgba(0,0,0,0.1)] justify-between px-[2px]">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="relative flex-1 border-r border-zinc-200 last:border-r-0 bg-white h-full hover:bg-zinc-100 transition-colors">
                            {![2, 6, 9, 13].includes(i) && (
                                <div className="absolute top-0 right-[-50%] w-[60%] h-[65%] bg-zinc-900 rounded-b-sm z-10 border border-black hover:bg-zinc-800 transition-colors shadow-sm" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium relative z-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[var(--text-main)]/80 transition-colors hover:text-[var(--text-main)]">
                    <Layers size={14} className="text-[var(--text-main)]/60" />
                    <span>10,000+ MIDI Files</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[var(--text-main)]/80 transition-colors hover:text-[var(--text-main)]">
                    <MonitorPlay size={14} className="text-[var(--text-main)]/60" />
                    <span>88-Key Visualizer</span>
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
Main landing page Hero section featuring animations and a drag-and-drop zone to start the core workflow.

React Concepts Used:
- `useEffect` for one-off setup (particle generation).
- Functional CSS styling based on component state (`isDragActive`).
*/