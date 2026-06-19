import React, { useMemo } from 'react';
import { initializeAudioEngine, getSynth } from '../../utils/audioEngine';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/*
PURPOSE:
Converts a raw MIDI number (e.g., 60) into scientific pitch notation (e.g., "C4") required by Tone.js.
*/
function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTES[midi % 12];
  return `${noteName}${octave}`;
}

/*
PURPOSE:
Renders a playable horizontal piano keyboard (88 keys) typically shown at the bottom of the screen.

REACT CONCEPT:
`useMemo` for heavy calculations.
*/
export default function PianoKeyboard({ activeNotes = [] }) {
  const START_MIDI = 21; // A0 (Standard 88-key piano start)
  const TOTAL_KEYS = 88;

  /*
  VIVA QUESTION:
  Why do you wrap the `activeMidiSet` in `useMemo`?

  VIVA ANSWER:
  `activeNotes` is an array of objects passed down as props, which updates frequently during playback. Creating a `Set` takes O(N) time. By using `useMemo`, we only recreate the Set when the `activeNotes` array actually changes, rather than on every single React render cycle. We use a Set instead of an Array for O(1) lookup time during the rendering of the 88 individual keys.
  */
  const activeMidiSet = useMemo(() => {
    return new Set(activeNotes.map((note) => note.midi || note));
  }, [activeNotes]);

  /*
  PURPOSE:
  Generates the structural array for the 88 keys exactly once on component mount.
  */
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

  /*
  PURPOSE:
  Directly triggers the Tone.js audio engine when a user clicks a key.
  */
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

        {/* Render White Keys First */}
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

              {/* Label only the 'C' notes to avoid clutter */}
              {key.midi % 12 === 0 && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-400 pointer-events-none select-none">
                  C{Math.floor(key.midi / 12) - 1}
                </span>
              )}
            </div>
          );
        })}

        {/* Render Black Keys Absolutely Positioned over White Keys */}
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
A full 88-key interactive piano component capable of playing audio via Tone.js directly.

React Concepts Used:
- Heavy use of `useMemo` to prevent recalculating the layout of 88 keys on every render.
- CSS Absolute Positioning for dynamic black key placement over CSS Flexbox for white keys.

Most Likely Viva Questions:
1. Explain how the black keys are positioned exactly between the white keys.

Expected Answers:
1. The white keys are rendered using a CSS flexbox (`flex-1`), meaning they automatically divide the container width equally. For the black keys, we calculate their position using percentages. We determine how many white keys come *before* the black key. We multiply that count by the percentage width of a single white key to find the exact pixel coordinate of the gap. We then set the black key's `left` CSS property to that gap, minus half of the black key's own width to perfectly center it.
*/