import re

# 1. Update DraggableNote.jsx
with open('src/components/editor/DraggableNote.jsx', 'r') as f:
    dn = f.read()

dn = dn.replace('onClick={(e) => { e.stopPropagation(); onSelect(note.id); }}', 
                'onPointerDown={(e) => { e.stopPropagation(); onSelect(note.id, e.shiftKey || e.metaKey); }}')

with open('src/components/editor/DraggableNote.jsx', 'w') as f:
    f.write(dn)

# 2. Update PianoRollCanvas.jsx
with open('src/components/editor/PianoRollCanvas.jsx', 'r') as f:
    pr = f.read()

# Replace selectedNoteId state with Set
pr = pr.replace('const [selectedNoteId, setSelectedNoteId] = useState(null);',
                'const [selectedNoteIds, setSelectedNoteIds] = useState(new Set());')

# Replace clearing selection
pr = pr.replace('setSelectedNoteId(null);', 'setSelectedNoteIds(new Set());')

# Replace delete keydown logic
old_key = '''  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNoteId) {
        deleteNote(selectedNoteId);
        setSelectedNoteId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, deleteNote]);'''

new_key = '''  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNoteIds.size > 0) {
        selectedNoteIds.forEach(id => deleteNote(id));
        setSelectedNoteIds(new Set());
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
        // Cmd+A to select all notes
        e.preventDefault();
        setSelectedNoteIds(new Set(rawNotes.map(n => n.id)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteIds, deleteNote, rawNotes]);'''

pr = pr.replace(old_key, new_key)

# Replace props passed to DraggableNote
old_props = '''                      isSelected={selectedNoteId === note.id}
                      isPlaying={activeNoteIds.has(note.id)}
                      onSelect={setSelectedNoteId}'''

new_props = '''                      isSelected={selectedNoteIds.has(note.id)}
                      isPlaying={activeNoteIds.has(note.id)}
                      onSelect={(id, multi) => {
                        setSelectedNoteIds(prev => {
                          const next = new Set(multi ? prev : []);
                          if (next.has(id)) next.delete(id);
                          else next.add(id);
                          return next;
                        });
                      }}'''

pr = pr.replace(old_props, new_props)

with open('src/components/editor/PianoRollCanvas.jsx', 'w') as f:
    f.write(pr)
