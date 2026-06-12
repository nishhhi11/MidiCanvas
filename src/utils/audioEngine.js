let Tone = null;
let audioCtx = null;
let masterGain = null;
let isInitialized = false;

const MAX_VOICES = 128;
const voices = [];
let voiceIndex = 0;

export async function initializeAudioEngine() {
  if (isInitialized) return;
  Tone = await import("tone");
  await Tone.start();

  audioCtx = Tone.context.rawContext;

  masterGain = new Tone.Gain(1.0).toDestination();

  for (let i = 0; i < MAX_VOICES; i++) {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    Tone.connect(gainNode, masterGain);

    voices.push({
      gainNode,
      oscNode: null,
      isActive: false,
      endTime: 0
    });
  }

  isInitialized = true;
}

function noteToFreq(note) {
  if (typeof note === 'number') {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  return new Tone.Frequency(note).toFrequency();
}

export function triggerCustomAttackRelease(note, durationStr, time, velocity = 0.8) {
  if (!isInitialized || !audioCtx) return;

  const freq = noteToFreq(note);
  let durationSecs = durationStr;
  if (typeof durationStr === 'string') {
    durationSecs = new Tone.Time(durationStr).toSeconds();
  }

  const attack = 0.02;
  const decay = 0.1;
  const sustainVal = 0.6 * velocity;
  const release = 0.5; 

  let voice = null;

  for (let i = 0; i < MAX_VOICES; i++) {
    const idx = (voiceIndex + i) % MAX_VOICES;
    if (time >= voices[idx].endTime) {
      voice = voices[idx];
      voiceIndex = (idx + 1) % MAX_VOICES;
      break;
    }
  }

  if (!voice) {
    voice = voices[voiceIndex];
    voiceIndex = (voiceIndex + 1) % MAX_VOICES;
  }

  if (voice.oscNode) {
    try { voice.oscNode.stop(time); } catch (e) {}
    voice.oscNode.disconnect();
  }

  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  osc.connect(voice.gainNode);
  voice.oscNode = osc;

  const gain = voice.gainNode.gain;
  gain.cancelScheduledValues(time);
  gain.setValueAtTime(0, time);
  gain.linearRampToValueAtTime(velocity, time + attack);
  gain.exponentialRampToValueAtTime(sustainVal || 0.01, time + attack + decay);

  const releaseTime = time + durationSecs;
  gain.setValueAtTime(sustainVal || 0.01, releaseTime);
  gain.exponentialRampToValueAtTime(0.001, releaseTime + release);

  osc.start(time);
  osc.stop(releaseTime + release + 0.1);

  voice.endTime = releaseTime + release + 0.1;
}

export function stopAllAudio() {
  if (!isInitialized) return;
  const now = audioCtx.currentTime;
  voices.forEach(voice => {
    voice.gainNode.gain.cancelScheduledValues(now);
    voice.gainNode.gain.setValueAtTime(0, now);
    if (voice.oscNode) {
      try { voice.oscNode.stop(now); } catch (e) {}
    }
    voice.endTime = now;
  });
}

export function getSynth() {
  return true; 
}

export function getAudioContextTime() {
  return audioCtx ? audioCtx.currentTime : 0;
}

