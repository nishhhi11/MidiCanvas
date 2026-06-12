with open('src/pages/EditorPage.jsx', 'r') as f:
    code = f.read()

# 1. Remove the invalid block at the end
bad_code_start = code.find('  const KEY_MAP = {')
if bad_code_start != -1:
    code = code[:bad_code_start].rstrip()

# 2. Insert inside the component
insert_idx = code.find('  const fileInputRef = useRef(null);')

keymap_logic = '''
  const [activePlayKeys, setActivePlayKeys] = useState(new Set());

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

if 'const [activePlayKeys' not in code:
    code = code[:insert_idx] + keymap_logic + '\n  ' + code[insert_idx:]

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(code)
