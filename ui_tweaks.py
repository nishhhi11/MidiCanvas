# 1. PianoRollCanvas.jsx
with open('src/components/editor/PianoRollCanvas.jsx', 'r') as f:
    prc = f.read()

# Add a slight difference in shade for white/black key rows
prc = prc.replace(
    "className={`absolute w-full border-b pointer-events-none ${row.isBlack ? 'bg-[#111111] border-[#222]' : 'bg-[#1a1a1a] border-[#222]'}`}",
    "className={`absolute w-full border-b pointer-events-none ${row.isBlack ? 'bg-[#0a0a0a] border-[#222]' : 'bg-[#161616] border-[#282828]'}`}"
)

# Thicker grid lines on measure
prc = prc.replace(
    "borderColor: line.isMeasure ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'",
    "borderColor: line.isMeasure ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'"
)

# And add subtle column backgrounds for every other measure
grid_old = '''            {gridLines.map((line, i) => (
              <div 
                key={`grid-${i}`}
                className={`absolute top-0 h-full border-r pointer-events-none z-0`}
                style={{ 
                  left: line.time * pixelsPerSecond,
                  borderColor: line.isMeasure ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'
                }}
              />
            ))}'''
grid_new = '''            {/* Measure Backgrounds */}
            {gridLines.filter(l => l.isMeasure).map((line, i) => i % 2 === 0 && (
              <div
                key={`bg-measure-${i}`}
                className="absolute top-0 h-full bg-white/[0.02] pointer-events-none z-0"
                style={{
                  left: line.time * pixelsPerSecond,
                  width: secondsPerMeasure * pixelsPerSecond
                }}
              />
            ))}
            {/* Grid Lines */}
            {gridLines.map((line, i) => (
              <div 
                key={`grid-${i}`}
                className={`absolute top-0 h-full border-r pointer-events-none z-0`}
                style={{ 
                  left: line.time * pixelsPerSecond,
                  borderColor: line.isMeasure ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                  borderRightWidth: line.isMeasure ? '2px' : '1px'
                }}
              />
            ))}'''
prc = prc.replace(grid_old, grid_new)

with open('src/components/editor/PianoRollCanvas.jsx', 'w') as f:
    f.write(prc)


# 2. DraggableNote.jsx
with open('src/components/editor/DraggableNote.jsx', 'r') as f:
    dn = f.read()

dn = dn.replace(
    "className={`absolute rounded-sm border ${isSelected ? 'border-white z-10' : 'border-black/50 z-0'} ${colorClass}`}",
    "className={`absolute rounded-sm border transition-all duration-150 ease-out cursor-pointer ${isSelected ? 'border-white z-10 scale-[1.03] shadow-lg shadow-white/20' : 'border-black/50 z-0 hover:scale-[1.01] hover:shadow-md'} ${colorClass}`}"
)

with open('src/components/editor/DraggableNote.jsx', 'w') as f:
    f.write(dn)


# 3. EditorPage.jsx
with open('src/pages/EditorPage.jsx', 'r') as f:
    ep = f.read()

# Make the STATUS and SHORTCUTS responsive
# STATUS section
ep = ep.replace(
    '<div className="text-2xl font-bold text-[#D4C5A9]">{totalNotesCount}</div>',
    '<div className="text-xl lg:text-2xl font-bold text-[#D4C5A9]">{totalNotesCount}</div>'
)
ep = ep.replace(
    '<div className="text-2xl font-bold text-[#D4C5A9]">{activeVoicesCount}</div>',
    '<div className="text-xl lg:text-2xl font-bold text-[#D4C5A9]">{activeVoicesCount}</div>'
)
ep = ep.replace(
    '<div className="text-[11px] text-[#888888]">NOTES</div>',
    '<div className="text-[9px] lg:text-[11px] text-[#888888]">NOTES</div>'
)
ep = ep.replace(
    '<div className="text-[11px] text-[#888888]">VOICES</div>',
    '<div className="text-[9px] lg:text-[11px] text-[#888888]">VOICES</div>'
)

# SHORTCUTS section
# Change text-base to text-sm lg:text-base
ep = ep.replace(
    '<div className="space-y-0.5 text-base">',
    '<div className="space-y-0.5 text-xs lg:text-sm">'
)

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(ep)

