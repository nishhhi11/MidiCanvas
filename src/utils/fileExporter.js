import { Midi } from "@tonejs/midi";

export function exportToMidi(midiData) {
  if (!midiData || !midiData.notes) return;

  // Create a new Midi object
  const midi = new Midi();

  // Set header info
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

  // Create tracks
  const trackMap = {};
  
  // Reconstruct tracks based on notes
  midiData.notes.forEach(note => {
    const trackIndex = note.track || 0;
    
    // Initialize track if it doesn't exist
    if (!trackMap[trackIndex]) {
      const track = midi.addTrack();
      const originalTrack = midiData.tracks?.find(t => t.id === trackIndex);
      if (originalTrack && originalTrack.name) {
        track.name = originalTrack.name;
      }
      trackMap[trackIndex] = track;
    }
    
    // Add note to track
    trackMap[trackIndex].addNote({
      midi: note.midi,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity || 0.8
    });
  });

  // Export to binary
  const binary = midi.toArray();
  const blob = new Blob([binary], { type: "audio/midi" });
  
  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  // Use original filename or generate one
  let downloadName = midiData.fileName || "export.mid";
  if (!downloadName.endsWith(".mid") && !downloadName.endsWith(".midi")) {
    downloadName += ".mid";
  }
  
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


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
