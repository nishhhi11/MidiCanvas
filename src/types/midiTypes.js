/**
 * midiTypes.js
 * JSDoc type definitions for MIDI data structures used throughout the app.
 */

/**
 * @typedef {Object} MidiNote
 * @property {string} id - Unique identifier for the note
 * @property {string} name - Human-readable note name (e.g. "C4")
 * @property {number} midi - MIDI note number (0-127)
 * @property {number} time - Start time in seconds
 * @property {number} duration - Duration in seconds
 * @property {number} velocity - Note velocity (0-127)
 * @property {number} track - Track index this note belongs to
 */

/**
 * @typedef {Object} MidiTrack
 * @property {number} id - Track index
 * @property {string} name - Track name (from MIDI metadata or auto-generated)
 * @property {number} noteCount - Number of notes in this track
 * @property {number} channel - MIDI channel
 * @property {string} instrument - GM instrument name (if available)
 */

/**
 * @typedef {Object} MidiData
 * @property {MidiNote[]} notes - All notes from all tracks, flattened
 * @property {MidiTrack[]} tracks - Track metadata
 * @property {number} tempo - Tempo in BPM
 * @property {number} duration - Total duration in seconds
 * @property {number} noteCount - Total number of notes
 * @property {number} trackCount - Total number of tracks
 * @property {string} timeSignature - Time signature string (e.g. "4/4")
 * @property {number} ticksPerBeat - MIDI ticks per beat (PPQ)
 */

/**
 * @typedef {Object} SavedFile
 * @property {number} id - Auto-incremented Dexie primary key
 * @property {string} name - Original filename
 * @property {number} duration - Duration in seconds
 * @property {number} trackCount - Number of tracks
 * @property {Date} savedAt - Timestamp when the file was saved
 */

/**
 * @typedef {'stopped'|'playing'|'paused'} PlaybackState
 */

/**
 * @typedef {Object} PlaybackStoreState
 * @property {PlaybackState} playbackState - Current transport state
 * @property {number} currentTime - Playhead position in seconds
 * @property {boolean} isLooping - Whether loop mode is enabled
 * @property {number} loopStart - Loop start time in seconds
 * @property {number} loopEnd - Loop end time in seconds
 * @property {number} playbackRate - Speed multiplier (0.25–2.0)
 * @property {boolean} isMetronomeOn - Whether metronome click is enabled
 * @property {MidiNote[]} activeNotes - Currently sounding notes
 */

export default {};
