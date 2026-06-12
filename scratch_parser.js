import fs from 'fs/promises';
import pkg from '@tonejs/midi';
const { Midi } = pkg;

async function run() {
  const fileData = await fs.readFile('./test.mid');
  const buffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
  
  const midi = new Midi(buffer);
  const notes = [];
  midi.tracks.forEach((track, trackIndex) => {
    track.notes.forEach((note) => {
      notes.push({
        track: trackIndex,
        name: note.name,
        midi: note.midi,
        velocity: note.velocity,
        duration: note.duration,
        time: note.time,
      });
    });
  });

  console.log(JSON.stringify(notes.slice(0, 10), null, 2));
}

run().catch(console.error);
