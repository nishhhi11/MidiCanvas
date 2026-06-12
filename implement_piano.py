import re

with open('src/pages/EditorPage.jsx', 'r') as f:
    code = f.read()

# 1. Add activePlayKeys state
state_injection = '''  const [notes, setNotes] = useState([]);
  const [activePlayKeys, setActivePlayKeys] = useState(new Set());'''
code = code.replace('  const [notes, setNotes] = useState([]);', state_injection)

# 2. Add KEY_MAP and Keyboard listener
keymap_logic = '''
  const KEY_MAP = {
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3', 'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
    ',': 'C4', 'l': 'C#4', '.': 'D4', ';': 'D#4', '/': 'E4', 'q': 'F4', '2': 'F#4', 'w': 'G4', '3': 'G#4', 'e': 'A4', '4': 'A#4', 'r': 'B4', 't': 'C5'
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.repeat) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const note = KEY_MAP[e.key.toLowerCase()];
      if (note) {
        if (e.type === 'keydown') {
           setActivePlayKeys(prev => new Set(prev).add(note));
           triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
        } else if (e.type === 'keyup') {
           setActivePlayKeys(prev => {
             const next = new Set(prev);
             next.delete(note);
             return next;
           });
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    }
  }, []);
'''

# Find a good place to insert it. Just before `const handlePlay`
insert_idx = code.find('  const handlePlay = useCallback(() => {')
code = code[:insert_idx] + keymap_logic + '\n' + code[insert_idx:]


# 3. Replace the Virtual Piano layout
# Current Virtual Piano Strip
vp_start_str = '{/* Virtual Piano Strip */}'
vp_start = code.find(vp_start_str)
vp_end_str = '      {/* Bottom Panels - Fixed Height (4-column grid) */}'
vp_end = code.find(vp_end_str)

vp_new = '''{/* Virtual Piano Strip - Full Width Realistic Layout */}
      <div className="flex-shrink-0 border-t border-[#2a2a2a] bg-black p-4 w-full flex justify-center">
        <div className="w-full max-w-6xl relative h-32 select-none">
          {/* White Keys */}
          <div className="flex w-full h-full">
            {virtualPianoKeys.filter(k => ![1, 3, 6, 8, 10].includes(virtualPianoKeys.indexOf(k) % 12)).map((note, idx) => {
              const isActive = activePlayKeys.has(note);
              const mappedKey = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note)?.toUpperCase() || '';
              return (
                <div 
                  key={note}
                  onPointerDown={() => {
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                  }}
                  onPointerUp={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}
                  onPointerLeave={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}
                  className={`flex-1 border-x border-[#222] rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer transition-colors ${
                    isActive ? 'bg-[#D4C5A9] text-black shadow-[0_0_15px_#D4C5A9]' : 'bg-[#FFFFF0] text-gray-500 hover:bg-[#e0e0e0]'
                  }`}
                  style={{ zIndex: 1 }}
                >
                  <span className="text-xs font-bold pointer-events-none mb-1">{note}</span>
                  <span className="text-[9px] font-mono pointer-events-none opacity-50 bg-black/10 px-1 rounded">{mappedKey}</span>
                </div>
              );
            })}
          </div>

          {/* Black Keys */}
          <div className="absolute top-0 left-0 w-full h-2/3 pointer-events-none">
            {virtualPianoKeys.map((note, globalIdx) => {
              const isBlackKey = [1, 3, 6, 8, 10].includes(globalIdx % 12);
              if (!isBlackKey) return null;
              
              const whiteKeyIdx = virtualPianoKeys.slice(0, globalIdx).filter(k => ![1, 3, 6, 8, 10].includes(virtualPianoKeys.indexOf(k) % 12)).length;
              const totalWhiteKeys = 15; // C3 to C5
              const leftPercent = (whiteKeyIdx / totalWhiteKeys) * 100;
              const widthPercent = (1 / totalWhiteKeys) * 60; // 60% of white key width
              
              const isActive = activePlayKeys.has(note);
              const mappedKey = Object.keys(KEY_MAP).find(k => KEY_MAP[k] === note)?.toUpperCase() || '';

              return (
                <div 
                  key={note}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}
                  onPointerLeave={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}
                  className={`absolute rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer pointer-events-auto transition-colors ${
                    isActive ? 'bg-[#D4C5A9] text-black shadow-[0_0_15px_#D4C5A9]' : 'bg-[#1a1a1a] border border-[#333] border-t-0 text-gray-400 hover:bg-[#2a2a2a]'
                  }`}
                  style={{ 
                    left: `calc(${leftPercent}% - ${widthPercent / 2}%)`, 
                    width: `${widthPercent}%`, 
                    height: '100%', 
                    zIndex: 10 
                  }}
                >
                  <span className="text-[10px] font-bold pointer-events-none mb-1">{note.replace('#', '♯')}</span>
                  <span className="text-[8px] font-mono pointer-events-none opacity-50 bg-white/10 px-1 rounded">{mappedKey}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

'''

code = code[:vp_start] + vp_new + code[vp_end:]

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(code)
