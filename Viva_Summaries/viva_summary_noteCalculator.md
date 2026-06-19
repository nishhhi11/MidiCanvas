# FILE SUMMARY: src/utils/noteCalculator.js

## Purpose
Music theory mathematical converters.

## Most Likely Viva Questions
1. Can you explain the math behind `midiToFrequency`?

## Expected Answers
1. Yes. The standard tuning pitch is A4, which is exactly 440 Hz and corresponds to MIDI note 69. Because the western musical scale divides an octave into 12 equal semitones (equal temperament), every semitone is a ratio of the 12th root of 2. So, `440 * (2 ^ ((midi - 69) / 12))` calculates the exact Hertz frequency for any given MIDI note.
