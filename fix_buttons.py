with open('src/pages/EditorPage.jsx', 'r') as f:
    ep = f.read()

# 1. Remove local states
ep = ep.replace("  const [loopStart, setLoopStart] = useState(0);\n", "")
ep = ep.replace("  const [loopEnd, setLoopEnd] = useState(4);\n", "")

# 2. Add to store
ep = ep.replace(
    "  const { playbackState, isLooping, toggleLoop, playbackRate, setPlaybackRate, currentTime } = usePlaybackStore();",
    "  const { playbackState, isLooping, toggleLoop, playbackRate, setPlaybackRate, currentTime, loopStart, loopEnd, setLoopPoints } = usePlaybackStore();"
)

# 3. Fix Set Start / Set End
old_start_end = '''              <div className="flex gap-1">
                <button 
                  onClick={() => setLoopStart(currentTime)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟳ Set Start
                </button>
                <button 
                  onClick={() => setLoopEnd(currentTime)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟲ Set End
                </button>
              </div>'''

new_start_end = '''              <div className="flex gap-1">
                <button 
                  onClick={() => setLoopPoints(currentTime, loopEnd)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟳ Set Start
                </button>
                <button 
                  onClick={() => setLoopPoints(loopStart, currentTime)} 
                  className="flex-1 py-2.5 bg-[#1a1a1a] rounded text-base text-[#FFFFF0] hover:bg-[#2a2a2a]"
                >
                  ⟲ Set End
                </button>
              </div>'''
ep = ep.replace(old_start_end, new_start_end)

# 4. Fix Keys / Notes UI
old_white_ui = '''                  <span className="text-xs font-bold pointer-events-none mb-1">{note}</span>
                  <span className="text-[9px] font-mono pointer-events-none opacity-50 bg-black/10 px-1 rounded">{mappedKey}</span>'''
new_white_ui = '''                  {showNoteNames && <span className="text-xs font-bold pointer-events-none mb-1">{note}</span>}
                  {highlightKeys && <span className="text-[9px] font-mono pointer-events-none opacity-50 bg-black/10 px-1 rounded">{mappedKey}</span>}'''
ep = ep.replace(old_white_ui, new_white_ui)

old_black_ui = '''                  <span className="text-[10px] font-bold pointer-events-none mb-1">{note.replace('#', '♯')}</span>
                  <span className="text-[8px] font-mono pointer-events-none opacity-50 bg-white/10 px-1 rounded">{mappedKey}</span>'''
new_black_ui = '''                  {showNoteNames && <span className="text-[10px] font-bold pointer-events-none mb-1">{note.replace('#', '♯')}</span>}
                  {highlightKeys && <span className="text-[8px] font-mono pointer-events-none opacity-50 bg-white/10 px-1 rounded">{mappedKey}</span>}'''
ep = ep.replace(old_black_ui, new_black_ui)

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(ep)
