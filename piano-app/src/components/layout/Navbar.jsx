import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🎹</span>
                <h1 className="font-bold text-xl">
                    PianoFlow AI
                </h1>
            </div>

            <div className="flex gap-8 text-zinc-300">
                <Link to="/">Home</Link>
                <Link to="/learn">Learn</Link>
                <Link to="/library">Library</Link>
                <Link to="/upload">Upload</Link>
            </div>

            <div className="w-10 h-10 rounded-full bg-cyan-500" />
        </nav>
    );
}