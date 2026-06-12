# 1. PianoRollCanvas.jsx (Telemetry Overlay)
with open('src/components/editor/PianoRollCanvas.jsx', 'r') as f:
    prc = f.read()

# Add isHovering state
prc = prc.replace(
    "const [pointerTime, setPointerTime] = useState(0); // Telemetry overlay support",
    "const [pointerTime, setPointerTime] = useState(0); // Telemetry overlay support\n  const [isHovering, setIsHovering] = useState(false);"
)

# Add onPointerEnter and onPointerLeave to the canvas container
prc = prc.replace(
    'onPointerMove={handlePointerMoveCanvas}',
    'onPointerMove={handlePointerMoveCanvas}\n            onPointerEnter={() => setIsHovering(true)}\n            onPointerLeave={() => setIsHovering(false)}'
)

# Render the Telemetry Overlay
telemetry_code = '''
            {/* Telemetry Overlay */}
            {isHovering && pointerTime > 0 && (
              <div 
                className="absolute top-0 bottom-0 pointer-events-none z-40 border-l border-dashed border-[#D4C5A9]/50"
                style={{ left: pointerTime * pixelsPerSecond }}
              >
                <div className="absolute top-2 left-1 bg-[#D4C5A9] text-black text-[10px] font-mono px-1.5 py-0.5 rounded-sm shadow-md whitespace-nowrap">
                  {Math.floor(pointerTime / 60)}:{(pointerTime % 60).toFixed(2).padStart(5, '0')}
                </div>
              </div>
            )}
'''

prc = prc.replace(
    "{/* Time Grid (Beats & Measures) */}",
    telemetry_code + "\n            {/* Time Grid (Beats & Measures) */}"
)

with open('src/components/editor/PianoRollCanvas.jsx', 'w') as f:
    f.write(prc)


# 2. EditorPage.jsx (Track Inspector Color Pickers)
with open('src/pages/EditorPage.jsx', 'r') as f:
    ep = f.read()

# Replace static div with input type=color
old_color_dot = '<div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />'
new_color_dot = '''
                        <div className="relative w-3 h-3 rounded-full overflow-hidden shrink-0 cursor-pointer shadow-[0_0_5px_rgba(0,0,0,0.5)] border border-white/20 hover:scale-110 transition-transform">
                          <input 
                            type="color" 
                            value={color} 
                            onChange={(e) => setTrackColor(track.id, e.target.value)}
                            className="absolute -inset-2 w-8 h-8 cursor-pointer"
                          />
                        </div>
'''

ep = ep.replace(old_color_dot, new_color_dot)

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(ep)

