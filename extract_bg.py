import os

# 1. Create BackgroundAnimations.jsx
bg_code = """import React from 'react';

export const BackgroundAnimations = () => {
    const notes = ["🎵", "🎶", "🎼", "🎹", "♭", "♯"];
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 15 }).map((_, i) => {
                const note = notes[Math.floor(Math.random() * notes.length)];
                const left = `${Math.random() * 100}%`;
                const delay = `${Math.random() * 15}s`;
                const duration = `${15 + Math.random() * 20}s`;
                const driftX = `${(Math.random() - 0.5) * 200}px`;
                const size = `${Math.random() * 2 + 1}rem`;

                return (
                    <div 
                        key={i}
                        className="absolute bottom-0 text-white opacity-0"
                        style={{
                            left,
                            fontSize: size,
                            animation: `music-drift ${duration} linear ${delay} infinite`,
                            "--drift-x": driftX
                        }}
                    >
                        {note}
                    </div>
                );
            })}
        </div>
    );
};
"""
with open('src/components/common/BackgroundAnimations.jsx', 'w') as f:
    f.write(bg_code)

# 2. Update LandingPage.jsx
with open('src/pages/LandingPage.jsx', 'r') as f:
    lp_code = f.read()

# remove BackgroundAnimations from LandingPage
start_idx = lp_code.find("const BackgroundAnimations = () => {")
end_idx = lp_code.find("export default function LandingPage() {")

if start_idx != -1 and end_idx != -1:
    lp_code = lp_code[:start_idx] + lp_code[end_idx:]

# add import
import_stmt = "import { BackgroundAnimations } from '../components/common/BackgroundAnimations';\n"
lp_code = import_stmt + lp_code

with open('src/pages/LandingPage.jsx', 'w') as f:
    f.write(lp_code)

# 3. Update LibraryPage.jsx
with open('src/pages/LibraryPage.jsx', 'r') as f:
    lib_code = f.read()

import_bg = "import { BackgroundAnimations } from '../components/common/BackgroundAnimations';\n"
lib_code = lib_code.replace('import { Search, HardDrive', import_bg + 'import { Search, HardDrive')

lib_code = lib_code.replace(
    '<div className="min-h-screen bg-[#050505] text-[#FFFFF0] flex flex-col relative">',
    '<div className="min-h-screen bg-bg-primary text-[#FFFFF0] flex flex-col relative">\n            <BackgroundAnimations />'
)

# Also make main z-10 so the background is behind it
lib_code = lib_code.replace(
    '<main className="flex-1 overflow-y-auto pb-32 pt-28 px-6">',
    '<main className="flex-1 overflow-y-auto pb-32 pt-28 px-6 relative z-10">'
)

with open('src/pages/LibraryPage.jsx', 'w') as f:
    f.write(lib_code)

