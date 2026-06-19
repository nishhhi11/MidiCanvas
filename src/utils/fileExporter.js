import { Midi } from "@tonejs/midi";

/*
PURPOSE:
Converts the application's internal JSON note array back into a binary Standard MIDI File (.mid) and triggers a browser download.

VIVA QUESTION:
How do you trigger a file download purely on the client side without a server?

VIVA ANSWER:
We create a `Blob` from the binary data and use `URL.createObjectURL(blob)` to generate a temporary internal URL. Then, we programmatically create an `<a>` (anchor) tag, set its `href` to that URL and its `download` attribute to the filename, append it to the document, call `.click()` on it to trigger the download, and immediately remove the tag. Finally, we call `URL.revokeObjectURL()` to free up browser memory.
*/
export function exportToMidi(midiData) {
  if (!midiData || !midiData.notes) return;

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
      if (originalTrack && originalTrack.name) {
        track.name = originalTrack.name;
      }
      trackMap[trackIndex] = track;
    }

    trackMap[trackIndex].addNote({
      midi: note.midi,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity || 0.8
    });
  });

  const binary = midi.toArray();
  const blob = new Blob([binary], { type: "audio/midi" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

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

/*
PURPOSE:
Similar to exportToMidi, but instead of triggering a download, it returns the raw binary data. Useful if we want to save edits back into IndexedDB.
*/
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
Utility functions to repackage internal JSON state back into Standard MIDI File binary blobs and trigger downloads.

JavaScript Concepts Used:
- Blob (Binary Large Object).
- Object URLs (`URL.createObjectURL`).
- Programmatic DOM Manipulation (creating/clicking anchor tags).
*/
