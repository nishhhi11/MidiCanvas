let Tone = null;
let audioCtx = null;
let masterGain = null;
let isInitialized = false;

// Custom Voice Pool
const MAX_VOICES = 128;
const voices = [];
let voiceIndex = 0;

export async function initializeAudioEngine() {
  if (isInitialized) return;
  Tone = await import("tone");
  await Tone.start();
  
  audioCtx = Tone.context.rawContext;
  
  // Create master routing
  masterGain = new Tone.Gain(1.0).toDestination();
  
  // Initialize voices
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

// Convert MIDI note number or name to frequency
function noteToFreq(note) {
  if (typeof note === 'number') {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
  // If it's a string like "C4", Tone.js handles it, but since we use raw context we need frequency.
  return new Tone.Frequency(note).toFrequency();
}

export function triggerCustomAttackRelease(note, durationStr, time, velocity = 0.8) {
  if (!isInitialized || !audioCtx) return;
  
  const freq = noteToFreq(note);
  let durationSecs = durationStr;
  if (typeof durationStr === 'string') {
    durationSecs = new Tone.Time(durationStr).toSeconds();
  }
  
  // Envelope parameters
  const attack = 0.02;
  const decay = 0.1;
  const sustainVal = 0.6 * velocity;
  const release = 0.5; // longer release for nicer fade
  
  // Find a free voice
  let voice = null;
  // First try to find completely free voice
  for (let i = 0; i < MAX_VOICES; i++) {
    const idx = (voiceIndex + i) % MAX_VOICES;
    if (time >= voices[idx].endTime) {
      voice = voices[idx];
      voiceIndex = (idx + 1) % MAX_VOICES;
      break;
    }
  }
  
  // If all busy, steal the oldest voice (simple round robin fallback)
  if (!voice) {
    voice = voices[voiceIndex];
    voiceIndex = (voiceIndex + 1) % MAX_VOICES;
  }
  
  // Clean up previous osc if any
  if (voice.oscNode) {
    try { voice.oscNode.stop(time); } catch (e) {}
    voice.oscNode.disconnect();
  }
  
  // Create new oscillator (must be fresh per Web Audio spec)
  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  osc.connect(voice.gainNode);
  voice.oscNode = osc;
  
  // Schedule envelope
  const gain = voice.gainNode.gain;
  gain.cancelScheduledValues(time);
  gain.setValueAtTime(0, time);
  gain.linearRampToValueAtTime(velocity, time + attack);
  gain.exponentialRampToValueAtTime(sustainVal || 0.01, time + attack + decay);
  
  const releaseTime = time + durationSecs;
  gain.setValueAtTime(sustainVal || 0.01, releaseTime);
  gain.exponentialRampToValueAtTime(0.001, releaseTime + release);
  
  // Start/stop oscillator
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

// Keep the old getter around just so playbackEngine doesn't crash on getSynth() initially
export function getSynth() {
  return true; // Return dummy truthy value so `if (!synth)` check passes
}

export function getAudioContextTime() {
  return audioCtx ? audioCtx.currentTime : 0;
}

