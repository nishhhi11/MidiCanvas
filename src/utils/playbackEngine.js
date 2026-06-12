let Tone = null;
import { initializeAudioEngine, getSynth, stopAllAudio, triggerCustomAttackRelease } from "./audioEngine";

let mutedTracksSet = new Set();
let soloedTracksSet = new Set();
let trackVolumesData = {};

export function setTrackStates(muted, soloed, volumes = {}) {
  mutedTracksSet = muted;
  soloedTracksSet = soloed;
  trackVolumesData = volumes;
}

export function setMasterVolume(val) {
  if (!Tone) return;

  if (val <= 0) {
    Tone.Destination.mute = true;
  } else {
    Tone.Destination.mute = false;
    Tone.Destination.volume.value = 20 * Math.log10(val);
  }
}

let metronomeSynth = null;

export async function initializeAudio() {
  Tone = await import("tone");
  await initializeAudioEngine();
  if (!metronomeSynth) {
    metronomeSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
    }).toDestination();
    metronomeSynth.volume.value = -10;
  }
}
export function playMidi(notes, tempo = 120, timeSignature = "4/4", duration = 0, isMetronomeOn = false) {
  const synth = getSynth();
  if (!synth) {
    console.warn("Audio not initialized. Ensure initializeAudio() is called first.");
    return;
  }

  if (!Tone) return;

  Tone.Transport.cancel();

  if (isMetronomeOn && tempo > 0 && duration > 0) {
    const beatDuration = 60 / tempo;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0]) || 4;

    for (let t = 0; t <= duration + beatDuration; t += beatDuration) {

      const beatIndex = Math.round(t / beatDuration);
      const isDownbeat = beatIndex % beatsPerMeasure === 0;

      Tone.Transport.schedule((time) => {
        if (metronomeSynth) {
          metronomeSynth.triggerAttackRelease(isDownbeat ? "C3" : "G2", "32n", time, isDownbeat ? 0.8 : 0.4);
        }
      }, t);
    }
  }

  notes.forEach((note) => {
    Tone.Transport.schedule((time) => {

      const isActive = soloedTracksSet.size > 0 
        ? soloedTracksSet.has(note.track) 
        : !mutedTracksSet.has(note.track);

      if (!isActive) return;

      const trackVol = trackVolumesData[note.track] !== undefined ? trackVolumesData[note.track] : 1.0;
      const finalVelocity = (note.velocity || 0.7) * trackVol;

      if (finalVelocity > 0) {
        triggerCustomAttackRelease(note.name, note.duration, time, finalVelocity);
      }
    }, note.time);
  });

  Tone.Transport.start();
}

export function pauseMidi() {
  if (!Tone) return;
  Tone.Transport.pause();
}

export function stopMidi() {
  if (Tone) {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
  stopAllAudio();
}

export function setPlaybackSpeed(speed) {
  if (!Tone) return;
  Tone.Transport.playbackRate = speed;
}

export function resumeMidi() {
  if (!Tone) return;
  Tone.Transport.start();
}

export function getCurrentTime() {
  return Tone ? Tone.Transport.seconds : 0;
}

export function seek(time) {
  if (!Tone) return;
  Tone.Transport.seconds = time;
}