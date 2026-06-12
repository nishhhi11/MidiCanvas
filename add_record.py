import re

# 1. Update fileExporter.js
with open('src/utils/fileExporter.js', 'r') as f:
    fe = f.read()

generate_func = '''
export function generateMidiBinary(midiData) {
  if (!midiData || !midiData.notes) return null;
  const midi = new Midi();
  midi.header.setTempo(midiData.tempo || 120);
  
  if (midiData.timeSignature) {
    const [num, den] = midiData.timeSignature.split("/").map(Number);
    if (!isNaN(num) && !isNaN(den)) {
      midi.header.timeSignatures.push({
        ticks: 0,
        timeSignature: [num, den],
      });
    }
  }

  const trackMap = {};
  midiData.notes.forEach(note => {
    const trackIndex = note.track || 0;
    if (!trackMap[trackIndex]) {
      const track = midi.addTrack();
      const originalTrack = midiData.tracks?.find(t => t.id === trackIndex);
      if (originalTrack && originalTrack.name) track.name = originalTrack.name;
      trackMap[trackIndex] = track;
    }
    trackMap[trackIndex].addNote({
      midi: note.midi,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity || 0.8
    });
  });

  return midi.toArray();
}
'''
if 'generateMidiBinary' not in fe:
    fe += '\n' + generate_func
    with open('src/utils/fileExporter.js', 'w') as f:
        f.write(fe)

# 2. Update EditorPage.jsx
with open('src/pages/EditorPage.jsx', 'r') as f:
    ep = f.read()

# Imports
ep = ep.replace('import { exportToMidi } from "../utils/fileExporter";', 'import { exportToMidi, generateMidiBinary } from "../utils/fileExporter";')

# State injection
state_injection = '''
  const [isRecording, setIsRecording] = useState(false);
  const recordingStartTime = useRef(0);
  const recordedNotes = useRef([]);
  const activeRecordingNotes = useRef(new Map());

  const noteToMidi = (note) => {
     const notesArr = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
     const octave = parseInt(note.slice(-1));
     const name = note.slice(0, -1);
     return octave * 12 + notesArr.indexOf(name) + 12; 
  };

  const toggleRecord = async () => {
     if (isRecording) {
         setIsRecording(false);
         // flush remaining active notes
         activeRecordingNotes.current.forEach((startTime, note) => {
             const duration = (performance.now() - startTime) / 1000;
             const relativeStart = (startTime - recordingStartTime.current) / 1000;
             recordedNotes.current.push({
                 id: `rec-${recordedNotes.current.length}`,
                 name: note,
                 midi: noteToMidi(note),
                 time: relativeStart,
                 duration: duration,
                 velocity: 0.8,
                 track: 0
             });
         });
         activeRecordingNotes.current.clear();

         if (recordedNotes.current.length > 0) {
             const lastNote = recordedNotes.current[recordedNotes.current.length - 1];
             const trackDuration = lastNote.time + lastNote.duration + 1;
             
             const newMidiData = {
                 fileName: `Recording ${new Date().toLocaleString()}`,
                 tempo: 120,
                 trackCount: 1,
                 noteCount: recordedNotes.current.length,
                 duration: trackDuration,
                 timeSignature: "4/4",
                 notes: [...recordedNotes.current],
                 tracks: [{ id: 0, name: "Recorded Track", noteCount: recordedNotes.current.length }]
             };

             const binary = generateMidiBinary(newMidiData);
             if (binary) {
                 await saveFile(newMidiData, binary);
                 setMidiData(newMidiData);
             }
         }
     } else {
         recordedNotes.current = [];
         activeRecordingNotes.current.clear();
         recordingStartTime.current = performance.now();
         setIsRecording(true);
     }
  };
'''

insert_state_idx = ep.find('  const KEY_MAP = {')
ep = ep[:insert_state_idx] + state_injection + '\n' + ep[insert_state_idx:]


# Hook up the recording logic to handleKey
old_handle_key = '''        if (e.type === 'keydown') {
           setActivePlayKeys(prev => new Set(prev).add(note));
           triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
        } else if (e.type === 'keyup') {
           setActivePlayKeys(prev => {
             const next = new Set(prev);
             next.delete(note);
             return next;
           });
        }'''

new_handle_key = '''        if (e.type === 'keydown') {
           if (!activePlayKeys.has(note)) {
               setActivePlayKeys(prev => new Set(prev).add(note));
               triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
               if (isRecording) {
                   activeRecordingNotes.current.set(note, performance.now());
               }
           }
        } else if (e.type === 'keyup') {
           setActivePlayKeys(prev => {
             const next = new Set(prev);
             next.delete(note);
             return next;
           });
           if (isRecording && activeRecordingNotes.current.has(note)) {
               const startTime = activeRecordingNotes.current.get(note);
               const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
               const relativeStart = (startTime - recordingStartTime.current) / 1000;
               recordedNotes.current.push({
                   id: `rec-${recordedNotes.current.length}`,
                   name: note,
                   midi: noteToMidi(note),
                   time: relativeStart,
                   duration: duration,
                   velocity: 0.8,
                   track: 0
               });
               activeRecordingNotes.current.delete(note);
           }
        }'''
ep = ep.replace(old_handle_key, new_handle_key)

# Add isRecording to handleKey dependency array!
ep = ep.replace('  }, []);', '  }, [isRecording]);')


# Update onPointerDown / onPointerUp in the render functions
old_pointer_down_white = '''                  onPointerDown={() => {
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                  }}'''
new_pointer_down_white = '''                  onPointerDown={() => {
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                    if (isRecording) activeRecordingNotes.current.set(note, performance.now());
                  }}'''
ep = ep.replace(old_pointer_down_white, new_pointer_down_white)

old_pointer_up_white = '''                  onPointerUp={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}'''
new_pointer_up_white = '''                  onPointerUp={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}'''
ep = ep.replace(old_pointer_up_white, new_pointer_up_white)

# Fix PointerLeave which acts as Up
ep = ep.replace('''                  onPointerLeave={() => {
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}''', new_pointer_up_white.replace('onPointerUp', 'onPointerLeave'))

# Do the same for black keys
old_pointer_down_black = '''                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                  }}'''
new_pointer_down_black = '''                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => new Set(prev).add(note));
                    triggerCustomAttackRelease(note, 0.3, getAudioContextTime(), 0.8);
                    if (isRecording) activeRecordingNotes.current.set(note, performance.now());
                  }}'''
ep = ep.replace(old_pointer_down_black, new_pointer_down_black)

old_pointer_up_black = '''                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}'''
new_pointer_up_black = '''                  onPointerUp={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                    if (isRecording && activeRecordingNotes.current.has(note)) {
                        const startTime = activeRecordingNotes.current.get(note);
                        const duration = Math.max(0.1, (performance.now() - startTime) / 1000);
                        const relativeStart = (startTime - recordingStartTime.current) / 1000;
                        recordedNotes.current.push({
                            id: `rec-${recordedNotes.current.length}`, name: note, midi: noteToMidi(note), time: relativeStart, duration: duration, velocity: 0.8, track: 0
                        });
                        activeRecordingNotes.current.delete(note);
                    }
                  }}'''
ep = ep.replace(old_pointer_up_black, new_pointer_up_black)

ep = ep.replace('''                  onPointerLeave={(e) => {
                    e.stopPropagation();
                    setActivePlayKeys(prev => { const n = new Set(prev); n.delete(note); return n; });
                  }}''', new_pointer_up_black.replace('onPointerUp', 'onPointerLeave'))

# Add Record Button UI to Transport
record_btn = '''
          <button 
            onClick={toggleRecord}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-600 text-white shadow-[0_0_15px_#dc2626] animate-pulse' 
                : 'bg-[#2a2a2a] text-[#888888] hover:bg-[#3a3a3a] hover:text-[#FFFFF0]'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-current" />
          </button>'''

ep = ep.replace('          {/* Play/Pause Button */}', record_btn + '\n          {/* Play/Pause Button */}')


with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(ep)
