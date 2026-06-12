import { Midi } from "@tonejs/midi";

self.onmessage = async (e) => {
  try {
    const { buffer, name } = e.data;
    const midi = new Midi(buffer);
    let totalNotes = 0;
    const notes = [];

    midi.tracks.forEach((track, trackIndex) => {
      track.notes.forEach((note, noteIndex) => {
        totalNotes++;
        notes.push({
          id: `t${trackIndex}-n${noteIndex}`,
          track: trackIndex,
          name: note.name,
          midi: note.midi,
          velocity: note.velocity,
          duration: note.duration,
          time: note.time,
        });
      });
    });

    const parsed = {
      fileName: name,
      tempo: midi.header.tempos?.[0]?.bpm ? Math.round(midi.header.tempos[0].bpm) : 120,
      trackCount: midi.tracks.length,
      noteCount: totalNotes,
      duration: Math.round(midi.duration),
      timeSignature: midi.header.timeSignatures?.[0]
        ? `${midi.header.timeSignatures[0].timeSignature[0]}/${midi.header.timeSignatures[0].timeSignature[1]}`
        : "4/4",
      notes,
      tracks: midi.tracks.map((track, index) => ({
        id: index,
        name: track.name || `Track ${index + 1}`,
        noteCount: track.notes.length,
      })),
    };

    self.postMessage({ success: true, parsed });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
