import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/*
PURPOSE:
Renders the top navigation bar, highlighting the active route and providing a theme toggle switch.

REACT CONCEPT:
Component consuming Context (`useTheme`) and Route State (`useLocation`).
*/
export default function Navbar() {
    // Hook to get the current URL path so we can highlight the active nav item
    const location = useLocation();
    
    // Custom hook pulling the theme state from our ThemeProvider Context
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
                    // Check if this link is the currently active route
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={label}
                            to={path}
                            className={`relative px-2 py-1 transition-all duration-300 uppercase tracking-widest text-[10px]
                                ${isActive ? "text-[var(--text-main)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            {label}
                            {/* Visual indicator for active route */}
                            {isActive && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[var(--primary)] rounded-t-md shadow-[0_0_8px_var(--primary)]" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="flex-1 flex justify-end">
                {/* 
                PURPOSE: Theme Toggle Button 
                VIVA QUESTION: How does toggling the theme here affect the rest of the app?
                VIVA ANSWER: `setTheme` updates the state inside the `ThemeProvider` Context. Since `Navbar` and the rest of the app are wrapped in this provider, updating the context causes all components relying on CSS variables (which the provider updates on the root HTML element) to instantly reflect the new colors.
                */}
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
A persistent navigation header that sits at the top of the application pages (Landing, Library).

Data Flow:
`useLocation` reads URL -> React updates UI to highlight active link.
Click Theme Toggle -> Context Updates -> DOM `<html class="dark/light">` updates -> CSS Variables Change.

React Concepts Used:
- `useLocation` hook from React Router to conditionally apply CSS classes.
- Consuming React Context (`useTheme`).

Most Likely Viva Questions:
1. How does the active link highlight work?

Expected Answers:
1. We use the `useLocation` hook from `react-router-dom` to get the current pathname (e.g., `/studio`). When rendering the array of links using `.map()`, we check if `location.pathname === path`. If it's true, we dynamically inject a specific CSS class to highlight that link and render a small underline `span`.
*/