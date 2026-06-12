import { Link } from "react-router-dom";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useMidiParser } from "../../hooks/useMidiParser";

export default function CTASection() {
    const navigate = useNavigate();
    const { parse } = useMidiParser();

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
        noClick: true 
    });

    return (
        <section 
            {...getRootProps()}
            className={`py-32 px-6 border-t border-border/50 text-center relative transition-all duration-500 overflow-hidden
                ${isDragActive ? 'bg-white/[0.02] scale-[1.01]' : 'bg-transparent'}`}
        >
            <input {...getInputProps()} />

            <div className="max-w-4xl mx-auto glass-strong p-16 rounded-[40px] relative z-10 animate-border-glow overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-zinc-500/5 opacity-50 pointer-events-none" />

                <div className="text-4xl mb-8 animate-float relative z-10">🎹</div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6 relative z-10">
                    Ready to dive into your MIDI files?
                </h2>
                <p className="text-lg text-text-muted mb-12 relative z-10">
                    No installation. No account. Just drag and drop.
                </p>

                <div className="flex flex-col items-center gap-6 relative z-10">
                    <button 
                        onClick={open}
                        className="px-10 py-5 rounded-2xl text-white text-base font-bold transition-all hover:scale-[1.04] active:scale-[0.98] relative group overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 0 30px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">✨ Upload MIDI to Editor</span>
                    </button>
                    <p className="text-text-muted text-xs font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                        or drag a MIDI file anywhere
                    </p>
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </section>
    );
}