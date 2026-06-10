import * as Tone from "tone";
import { useMidiStore } from "../store/midiStore";
import { inputManager } from "./inputManager";

let midiAccess = null;

const onMIDIMessage = (message) => {
  const command = message.data[0] >> 4;
  const channel = message.data[0] & 0xf;
  const noteNumber = message.data[1];
  const velocity = message.data.length > 2 ? message.data[2] : 0;
  
  // Calculate passive latency
  const latency = Math.round(performance.now() - message.timeStamp);
  useMidiStore.getState().setMidiLatency(latency);

  // Note On
  if (command === 9 && velocity > 0) {
    const noteName = Tone.Frequency(noteNumber, "midi").toNote();
    inputManager.handleNoteOn(noteName);
  }
  // Note Off
  else if (command === 8 || (command === 9 && velocity === 0)) {
    const noteName = Tone.Frequency(noteNumber, "midi").toNote();
    inputManager.handleNoteOff(noteName);
  }
  // Control Change
  else if (command === 11) {
    if (noteNumber === 64) {
      // Sustain pedal
      const isPressed = velocity > 63;
      useMidiStore.getState().setSustainPedal(isPressed);
    }
  }
};

const updateDevices = (access) => {
  const inputs = access.inputs.values();
  let foundDevice = null;
  
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    foundDevice = input.value;
    input.value.onmidimessage = onMIDIMessage;
    break; // Attach to first available input for now
  }

  if (foundDevice) {
    useMidiStore.getState().setActiveMidiDevice({
      name: foundDevice.name || "Unknown MIDI Device",
      manufacturer: foundDevice.manufacturer || "Unknown",
      connection: foundDevice.connection,
      state: foundDevice.state
    });
  } else {
    useMidiStore.getState().setActiveMidiDevice(null);
  }
};

export const initializeMidiHardware = async () => {
  if (navigator.requestMIDIAccess) {
    try {
      midiAccess = await navigator.requestMIDIAccess();
      
      updateDevices(midiAccess);
      
      midiAccess.onstatechange = () => {
        updateDevices(midiAccess);
      };
      
    } catch (err) {
      console.warn("MIDI Access Denied or Unavailable: ", err);
      useMidiStore.getState().setActiveMidiDevice(null);
    }
  } else {
    console.warn("Web MIDI API not supported by this browser.");
  }
};
