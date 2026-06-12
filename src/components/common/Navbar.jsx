import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();

    return (
        <nav
            className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between glass-panel border-b-0"
            style={{
                background: "rgba(5, 5, 5, 0.6)",
                borderBottom: "1px solid rgba(255, 255, 240, 0.05)",
            }}
        >
            <div className="flex-1 flex items-center justify-start">
                <Link to="/" className="flex items-center gap-3 group">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,240,0.15)]"
                        style={{
                            background: "#0A0A0A",
                            border: "1px solid rgba(255, 255, 240, 0.15)",
                        }}
                    >
                        🎹
                    </div>
                    <h1 className="font-bold text-lg text-[#FFFFF0] tracking-widest group-hover:text-white transition-colors uppercase">
                        MIDI CANVAS
                    </h1>
                </Link>
            </div>

            <div className="hidden md:flex items-center justify-center gap-6 font-medium text-sm flex-none">
                {[
                    { label: "🎹 Piano Roll Editor", path: "/studio" },
                    { label: "📁 MIDI Library", path: "/library" }
                ].map(({label, path}) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={label}
                            to={path}
                            className={`relative px-2 py-1 transition-all duration-300 uppercase tracking-widest text-xs
                                ${isActive ? "text-[#FFFFF0]" : "text-[#999999] hover:text-[#FFFFF0]"}`}
                        >
                            {label}
                            {isActive && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#FFFFF0] rounded-t-md shadow-[0_0_8px_rgba(255,255,240,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="flex-1 flex justify-end">

            </div>
        </nav>
    );
}