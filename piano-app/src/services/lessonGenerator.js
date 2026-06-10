export function generateLesson(parsedMidi) {
  const { notes = [] } = parsedMidi;

  // 1. Separate notes by hand
  // Simple heuristic: MIDI 60 is Middle C. Right hand generally plays Middle C and above.
  const rightHandNotes = notes.filter((n) => n.midi >= 60);
  const leftHandNotes = notes.filter((n) => n.midi < 60);
  const bothHandsNotes = notes;

  const rightHandCount = rightHandNotes.length;
  const leftHandCount = leftHandNotes.length;
  const totalNotes = notes.length;

  /* 
    FUTURE INTERACTIVE LESSON MODE NOTES:
    - Step Integration: When the UI loads "Step 1", it will conditionally pass ONLY `rightHandNotes` 
      to the PianoRoll renderer and PlaybackEngine. 
    - Isolated Playback: This means the engine will only play the isolated melody, allowing 
      the student to focus on one hand without distraction.
    - Performance Grading: The scoring system will only compare user input against the `noteCount` 
      for the currently active step.
  */
  
  const steps = [
    {
      id: "step-1-right-hand",
      title: "Step 1: Right Hand Practice",
      description: "Focus purely on the melody using your right hand.",
      noteCount: rightHandCount
    },
    {
      id: "step-2-left-hand",
      title: "Step 2: Left Hand Practice",
      description: "Learn the bassline and chords with your left hand.",
      noteCount: leftHandCount
    },
    {
      id: "step-3-both-hands",
      title: "Step 3: Both Hands Practice",
      description: "Combine both hands at a comfortable pace.",
      noteCount: totalNotes
    },
    {
      id: "step-4-full-performance",
      title: "Step 4: Full Song Performance",
      description: "Play the entire song at full speed without stopping.",
      noteCount: totalNotes
    }
  ];

  return {
    rightHandNotes,
    leftHandNotes,
    bothHandsNotes,
    steps,
    totalNotes,
    rightHandCount,
    leftHandCount
  };
}
