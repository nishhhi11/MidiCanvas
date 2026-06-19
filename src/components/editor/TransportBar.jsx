import playbackEngine from "../../../../utils/playbackEngine";
import usePlaybackStore from "../../../../stores/playbackStore";

/*
PURPOSE:
A UI component rendering the main Play, Pause, and Stop buttons for the application.

REACT CONCEPT:
A Presentational Component connecting to Global State.
*/
export default function PlaybackControls({
    notes = [],
}) {
    /*
    PURPOSE:
    Subscribing to the Zustand playback store to get the current playing status and the functions to change it.
    */
    const {
        playing,
        play,
        pause,
        stop,
    } = usePlaybackStore();

    /*
    PURPOSE:
    Starts the audio engine and updates the UI state.
    */
    const handlePlay = async () => {
        if (!notes.length) return;

        // Starts the Tone.js context (required by browsers before playing sound)
        await playbackEngine.start();

        // Feeds the current MIDI notes into the scheduling engine
        playbackEngine.loadNotes(notes);

        // Starts the internal audio clock
        playbackEngine.play();

        // Updates Zustand state so the UI button changes to "Playing"
        play();
    };

    /*
    PURPOSE:
    Pauses playback without resetting the playhead position.
    */
    const handlePause = () => {
        playbackEngine.stop(); // Stops audio clock
        pause();               // Updates Zustand
    };

    /*
    PURPOSE:
    Stops playback entirely and resets the playhead.
    */
    const handleStop = () => {
        playbackEngine.stop();
        stop();
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"> 
            <h2 className="text-lg font-bold mb-4">Playback Controls</h2>

            <div className="flex gap-4">
                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold"
                >
                    ▶ Play
                </button>

                <button
                    onClick={handlePause}
                    className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
                >
                    ⏸ Pause
                </button>

                <button
                    onClick={handleStop}
                    className="px-4 py-2 bg-red-500 text-black rounded-lg font-semibold"
                >
                    ⏹ Stop
                </button>
            </div>

            <p className="mt-4 text-zinc-400">
                Status: {playing ? "Playing" : "Stopped"}
            </p>
        </div>
    );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Provides the UI buttons for Play, Pause, and Stop, and wires them up to both the imperative audio engine and the declarative React state.

Data Flow:
User Clicks Play -> `handlePlay` calls `playbackEngine.start()` (Audio Layer) -> `handlePlay` calls `play()` (Zustand Layer) -> Component re-renders with new status.

React Concepts Used:
- Using custom hooks (`usePlaybackStore`) to connect to global state.

Most Likely Viva Questions:
1. Why does `handlePlay` need to call both `playbackEngine.play()` and `play()`?

Expected Answers:
1. Because our application uses a dual-architecture. `playbackEngine.play()` is an imperative command that talks directly to the Web Audio API to physically start making sound. `play()` is a declarative command that updates the Zustand store so React knows to re-render the UI and show the "Playing" text. They must be kept in sync.
*/
