import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMidiParser } from "../../hooks/useMidiParser";
import { Music, Activity, MonitorPlay, Layers } from "lucide-react";

export default function HeroSection() {
    const navigate = useNavigate();
    const { parse } = useMidiParser();
    const [particles, setParticles] = useState([]);

    useEffect(() => {

        const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            opacity: Math.random() * 0.15 + 0.05
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

            <div 
                className="absolute inset-0 z-0 animate-float-bg pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at top, rgba(255,255,240,0.06), transparent 50%)'
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

            <div className="absolute top-20 left-10 text-[120px] opacity-[0.03] blur-[2px] rotate-[-10deg] pointer-events-none z-0 select-none">🎹</div>
            <div className="absolute top-40 right-20 text-[150px] opacity-[0.03] blur-[2px] rotate-[15deg] pointer-events-none z-0 select-none">🎹</div>
            <div className="absolute bottom-40 left-1/4 text-[100px] opacity-[0.03] blur-[2px] rotate-[-20deg] pointer-events-none z-0 select-none">🎹</div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight relative z-10 max-w-5xl">
                MIDI Canvas — Parse, Edit, and Learn Piano from Any MIDI File
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mb-12 relative z-10 leading-relaxed">
                Turn any .mid file into an interactive piano lesson. Visualize notes, edit tracks, and practice at your own pace — entirely in your browser.
            </p>

            <div className="flex gap-4 mb-12 relative z-10">
                <button 
                    onClick={() => navigate("/studio")}
                    className="px-8 py-4 rounded-xl text-[#050505] bg-[#FFFFF0] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden ivory-glow"
                >
                    <span className="relative z-10 flex items-center gap-2">🎹 Launch Interactive Workspace</span>
                </button>
            </div>

            <div 
                {...getRootProps()} 
                className={`w-full max-w-2xl p-12 rounded-2xl cursor-pointer transition-all duration-300 relative z-10 group glass-panel
                    ${isDragActive ? 'scale-[1.03] border-2 border-[#FFFFF0] bg-white/5 shadow-[0_0_80px_rgba(255,255,240,0.25)]' : 'border border-transparent hover:-translate-y-1 hover:border-[#FFFFF0]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3 transition-transform group-hover:-translate-y-1">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isDragActive ? 'bg-[#FFFFF0]/20 scale-110 shadow-[0_0_30px_rgba(255,255,240,0.3)]' : 'bg-[#FFFFF0]/5 group-hover:bg-[#FFFFF0]/10 group-hover:shadow-[0_0_20px_rgba(255,255,240,0.1)]'}`}
                    >
                        <Music size={32} className={`transition-all duration-300 ${isDragActive ? 'text-white scale-110' : 'text-[#FFFFF0]/70 group-hover:scale-110'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FFFFF0] transition-all uppercase tracking-wide text-center">
                        {isDragActive ? "Release to Upload!" : (
                            <>
                                <span className="hidden md:inline">Drop MIDI File Here</span>
                                <span className="inline md:hidden">Tap to Select MIDI</span>
                            </>
                        )}
                    </h3>
                    <p className="text-[#999999] text-lg hidden md:block">or click to browse your computer</p>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-xs font-mono text-[#FFFFF0]/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            Supported format: .mid, .midi
                        </span>
                        <span className="text-sm italic text-[#FFFFF0]/40 mt-1">
                            Example: "Fur Elise.mid" or any song
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 mb-16 relative z-10 w-full max-w-2xl flex flex-col items-center opacity-90 select-none">

                <div className="w-full h-48 bg-black/40 rounded-t-xl border border-white/5 relative overflow-hidden backdrop-blur-sm">

                    <div className="absolute inset-0 flex w-full h-full pointer-events-none opacity-20">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={`grid-${i}`} className="flex-1 border-r border-white/10 last:border-r-0" />
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

                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                <div className="w-full h-1 bg-zinc-800 border-t border-white/20" />
                <div className="flex w-full h-14 bg-white rounded-b-xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] justify-between px-[2px]">

                    {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="relative flex-1 border-r border-zinc-200 last:border-r-0 bg-white h-full hover:bg-zinc-100 transition-colors">

                            {![2, 6, 9, 13].includes(i) && (
                                <div className="absolute top-0 right-[-50%] w-[60%] h-[65%] bg-zinc-900 rounded-b-sm z-10 border border-black hover:bg-zinc-800 transition-colors shadow-sm" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium relative z-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[#FFFFF0]/80 transition-colors hover:text-[#FFFFF0]">
                    <Layers size={14} className="text-[#FFFFF0]/60" />
                    <span>10,000+ MIDI Files</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[#FFFFF0]/80 transition-colors hover:text-[#FFFFF0]">
                    <MonitorPlay size={14} className="text-[#FFFFF0]/60" />
                    <span>88-Key Visualizer</span>
                </div>
            </div>
        </section>
    );
}