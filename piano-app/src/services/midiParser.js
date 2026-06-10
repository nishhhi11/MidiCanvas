import { Midi } from "@tonejs/midi";

export async function parseMidi(file) {
  const arrayBuffer = await file.arrayBuffer();

  const midi = new Midi(arrayBuffer);

  const notes = midi.tracks.flatMap((track) =>
    track.notes.map((note) => ({
      midi: note.midi,
      name: note.name,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity,
    }))
  );

  return {
    title: file.name,

    tempo:
      midi.header.tempos[0]?.bpm || 120,

    duration:
      midi.duration,

    tracks:
      midi.tracks.length,

    noteCount:
      notes.length,

    timeSignature:
      midi.header.timeSignatures[0]
        ?.timeSignature || [4, 4],

    notes,
  };
}
