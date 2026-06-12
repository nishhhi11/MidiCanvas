import React, { useMemo } from 'react';
import { initializeAudioEngine, getSynth } from '../../utils/audioEngine';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTES[midi % 12];
  return `${noteName}${octave}`;
}

export default function PianoKeyboard({ activeNotes = [] }) {
  const START_MIDI = 21; 
  const TOTAL_KEYS = 88;

  const activeMidiSet = useMemo(() => {
    return new Set(activeNotes.map((note) => note.midi || note));
  }, [activeNotes]);

  const keys = useMemo(() => {
    const layout = [];
    for (let i = 0; i < TOTAL_KEYS; i++) {
      const midi = START_MIDI + i;
      const noteClass = midi % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteClass);
      layout.push({ midi, isBlack });
    }
    return layout;
  }, []);

  const whiteKeys = useMemo(() => keys.filter((k) => !k.isBlack), [keys]);
  const blackKeys = useMemo(() => keys.filter((k) => k.isBlack), [keys]);

  const playNote = async (midi) => {
    await initializeAudioEngine();
    const synth = getSynth();
    if (synth) synth.triggerAttack(midiToNote(midi));
  };

  const stopNote = (midi) => {
    const synth = getSynth();
    if (synth) synth.triggerRelease(midiToNote(midi));
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-x-auto hide-scrollbar custom-scrollbar bg-black border border-white/10 rounded-b-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="relative flex h-full" style={{ minWidth: '800px' }}>

        {whiteKeys.map((key) => {
          const isActive = activeMidiSet.has(key.midi);

          return (
            <div
              key={key.midi}
              onMouseDown={() => playNote(key.midi)}
              onMouseUp={() => stopNote(key.midi)}
              onMouseLeave={() => stopNote(key.midi)}
              className={`flex-1 border-r border-b border-zinc-400/50 rounded-b-md relative shadow-inner transition-colors duration-75 cursor-pointer select-none ${
                isActive 
                  ? 'bg-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] z-0' 
                  : 'bg-gradient-to-b from-white to-gray-200 hover:from-gray-100 hover:to-gray-300'
              }`}
            >

              {key.midi % 12 === 0 && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-400 pointer-events-none select-none">
                  C{Math.floor(key.midi / 12) - 1}
                </span>
              )}
            </div>
          );
        })}

        {blackKeys.map((key) => {
          const isActive = activeMidiSet.has(key.midi);

          const whiteKeyWidth = 100 / whiteKeys.length;
          const whiteKeysBefore = whiteKeys.filter((wk) => wk.midi < key.midi).length;
          const leftPercent = whiteKeysBefore * whiteKeyWidth;

          const blackKeyWidth = whiteKeyWidth * 0.6;

          return (
            <div
              key={key.midi}
              onMouseDown={() => playNote(key.midi)}
              onMouseUp={() => stopNote(key.midi)}
              onMouseLeave={() => stopNote(key.midi)}
              className={`absolute top-0 rounded-b-md border border-zinc-950 z-10 transition-colors duration-75 cursor-pointer select-none ${
                isActive 
                  ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]' 
                  : 'bg-gradient-to-b from-[#111111] to-[#050505] hover:from-[#222] hover:to-[#111]'
              }`}
              style={{
                left: `calc(${leftPercent}% - ${blackKeyWidth / 2}%)`,
                width: `${blackKeyWidth}%`,
                height: '65%',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}