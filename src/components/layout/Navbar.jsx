import { Link } from "react-router-dom";

const navLinks = [
  "Home",
  "Features",
  "How It Works",
  "Songs",
  "Pricing",
];

export default function Navbar() {
    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl px-8 py-4 flex items-center justify-between rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🎹</span>
                <h1 className="font-bold text-xl text-white">
                    PianoFlow AI
                </h1>
            </div>

            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-300 hover:text-white transition"
                    >
                        {item}
                    </a>
                ))}
            </div>

            <Link to="/signup">
                <button
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition"
                >
                    Start Free
                </button>
            </Link>
        </nav>
    );
}