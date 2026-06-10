import * as Tone from "tone";

let metronomeLoop = null;
let clickSynth = null;

export const initializeMetronome = async () => {
  if (!clickSynth) {
    clickSynth = new Tone.MembraneSynth().toDestination();
  }
};

export const startMetronome = (bpm) => {
  if (metronomeLoop) {
    metronomeLoop.stop();
    metronomeLoop.dispose();
  }

  // Lock to initial BPM
  Tone.Transport.bpm.value = bpm;

  let beatCount = 0;
  metronomeLoop = new Tone.Loop((time) => {
    // High tick on 1, low tick on 2,3,4
    if (beatCount % 4 === 0) {
      clickSynth.triggerAttackRelease("C5", "32n", time, 1);
    } else {
      clickSynth.triggerAttackRelease("C4", "32n", time, 0.5);
    }
    beatCount++;
  }, "4n");

  metronomeLoop.start(0);
};

export const stopMetronome = () => {
  if (metronomeLoop) {
    metronomeLoop.stop();
    metronomeLoop.dispose();
    metronomeLoop = null;
  }
};
