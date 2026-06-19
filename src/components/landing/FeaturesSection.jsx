/*
PURPOSE:
A purely presentational component displaying the key technical capabilities of the app using a grid layout.

REACT CONCEPT:
Dumb/Presentational Component rendering static data.
*/
export default function FeaturesSection() {
    /*
    VIVA QUESTION:
    Why define this data array inside the component instead of outside?

    VIVA ANSWER:
    Since it contains JSX elements (like the `<>` fragment in the Real-Time Audio Playback description), putting it outside the component is perfectly fine too, as it doesn't depend on state. However, keeping it inside groups the logic and data tightly. If we needed translation/i18n later, it would need to be inside to access hooks.
    */
    const featureGroups = [
        {
            title: "Core Technology",
            features: [
                {
                    icon: "📂",
                    title: "Smart MIDI Parser",
                    desc: "Decodes MThd + MTrk chunks, delta-time, status bytes, and meta events"
                },
                {
                    icon: "🔊",
                    title: "Real-Time Audio Playback",
                    desc: (
                        <>
                            Web Audio oscillators with velocity-sensitive volume.
                            <span className="font-mono mt-3 mb-1 block text-[10px] bg-[#111] border border-white/5 p-2 rounded text-zinc-300">
                                f = 440 × 2^((note - 69) / 12) Hz
                            </span>
                            <span className="text-[10px] text-zinc-500 italic block">
                                *Where note = MIDI number (0–127)
                            </span>
                        </>
                    )
                },
                {
                    icon: "🎯",
                    title: "Snap to Grid",
                    desc: "Quantize notes to 1/4, 1/8, 1/16, or triplets"
                }
            ]
        },
        {
            title: "🎛️ Interface Components",
            features: [
                {
                    icon: "🎮",
                    title: "Playback Controls",
                    desc: "Play, Pause, Stop, Loop, BPM readout, and drag-and-drop upload"
                },
                {
                    icon: "🎼",
                    title: "Interactive Piano Roll",
                    desc: "Canvas grid + vertical keyboard. Click keys to hear notes. Drag, stretch, or delete notes."
                },
                {
                    icon: "🎚️",
                    title: "Track Mixer",
                    desc: "Mute, solo, volume per track. Master output control."
                }
            ]
        },
        {
            title: "Workflow",
            features: [
                {
                    icon: "🛡️",
                    title: "100% Client-Side — Your Privacy First",
                    desc: "No servers. No uploads. Your MIDI files never leave your device. Parse binary data locally, edit tracks instantly, and save your library to IndexedDB — all in your browser."
                },
                {
                    icon: "💾",
                    title: "Local Library (IndexedDB)",
                    desc: "Save unlimited MIDI projects directly to your browser. Your Library persists across sessions — no account needed. Export any track back to .mid anytime."
                },
                {
                    icon: "📤",
                    title: "Export to .mid",
                    desc: "Edit your tracks and export them back to a Standard MIDI File instantly."
                }
            ]
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text-main text-center mb-20 tracking-tight">🎹 What Makes MIDI Canvas Powerful</h2>

            <div className="space-y-24">
                {featureGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h3 className="text-xl font-semibold text-text-main mb-8 border-b border-white/10 pb-4 inline-block">{group.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.features.map((f, i) => (
                                <div key={i} className="glass-panel p-6 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ivory-glow">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFFF0]/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#FFFFF0]/10 transition-colors duration-500" />
                                    <div className="text-2xl mb-4 group-hover:scale-110 transition-transform origin-left relative z-10 w-12 h-12 flex items-center justify-center bg-[#050505] rounded-xl border border-[#FFFFF0]/10 shadow-[0_0_15px_rgba(255,255,240,0.05)]">
                                        {f.icon}
                                    </div>
                                    <h4 className="text-base font-semibold text-[#FFFFF0] mb-3 relative z-10">{f.title}</h4>
                                    <p className="text-xs text-[#999999] leading-relaxed relative z-10">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A static promotional section outlining the application's features for new users.

React Concepts Used:
- Rendering lists via `.map()`.
- Nested mapping (groups -> features).
*/