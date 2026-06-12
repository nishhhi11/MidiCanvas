import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-border bg-bg-primary text-sm text-text-muted">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left - Brand */}
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 font-bold text-text-main text-base">
                        <span>🎹</span> MIDI Canvas Studio
                    </div>
                    <p className="text-xs">Parse. Visualize. Edit. Playback.</p>
                </div>

                {/* Center - Links */}
                <div className="flex items-center gap-6 font-medium">
                    <Link to="/studio" className="hover:text-primary transition-colors">Editor</Link>
                    <Link to="/library" className="hover:text-primary transition-colors">Library</Link>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                        GitHub <span className="text-xs text-yellow-500">★ Star</span>
                    </a>
                </div>

                {/* Right - Meta */}
                <div className="flex flex-col items-center md:items-end gap-1 text-xs">
                    <p>Built with React • Web Audio API • IndexedDB</p>
                    <p>© 2026 Open Source MIT License</p>
                </div>

            </div>
        </footer>
    );
}