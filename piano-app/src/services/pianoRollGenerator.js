export function generatePianoRollData(notes) {
  let minMidi = Infinity;
  let maxMidi = -Infinity;
  let totalDuration = 0;

  const formattedNotes = notes.map((n, index) => {
    const startTime = n.time;
    const duration = n.duration;
    const endTime = startTime + duration;
    
    // Track min/max bounds for rendering the piano grid accurately
    if (n.midi < minMidi) minMidi = n.midi;
    if (n.midi > maxMidi) maxMidi = n.midi;
    
    // Find the absolute last moment of the song
    if (endTime > totalDuration) totalDuration = endTime;

    return {
      id: `note-${index}-${n.midi}-${startTime}`,
      note: n.name,
      midi: n.midi,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      /* 
        FUTURE RENDERER NOTES:
        - lane: Maps directly to the MIDI key number (e.g. 60 = Middle C). 
                The UI can use this to absolutely position the note horizontally along the keyboard (e.g. `left: (lane - minMidi) * keyWidth`).
        - startTime: The time in seconds when the note should hit the playhead.
                The UI uses this to position the note vertically on the falling canvas (e.g. `bottom: startTime * pixelsPerSecond`).
        - endTime: Allows the UI to easily calculate when the note has finished passing the playhead, meaning it can be unmounted or hidden to save memory.
      */
      lane: n.midi 
    };
  });

  return {
    notes: formattedNotes,
    totalDuration,
    minMidi: minMidi === Infinity ? 0 : minMidi,
    maxMidi: maxMidi === -Infinity ? 0 : maxMidi
  };
}
