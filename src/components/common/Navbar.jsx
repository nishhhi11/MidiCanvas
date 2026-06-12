import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between glass-panel border-b border-b-[var(--border)]">
            <div className="flex-1 flex items-center justify-start">
                <Link to="/" className="flex items-center gap-3 group">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--primary)]"
                        style={{
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        🎹
                    </div>
                    <h1 className="font-bold text-base text-[var(--text-main)] tracking-widest transition-colors uppercase">
                        MIDI CANVAS
                    </h1>
                </Link>
            </div>

            <div className="hidden md:flex items-center justify-center gap-6 font-medium text-xs flex-none">
                {[
                    { label: "🎹 Piano Roll Editor", path: "/studio" },
                    { label: "📁 MIDI Library", path: "/library" }
                ].map(({label, path}) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={label}
                            to={path}
                            className={`relative px-2 py-1 transition-all duration-300 uppercase tracking-widest text-[10px]
                                ${isActive ? "text-[var(--text-main)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            {label}
                            {isActive && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[var(--primary)] rounded-t-md shadow-[0_0_8px_var(--primary)]" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="flex-1 flex justify-end">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-main)]"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </nav>
    );
}