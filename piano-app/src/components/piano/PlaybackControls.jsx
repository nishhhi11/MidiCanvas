import playbackEngine from "../../services/playbackEngine";
import usePlaybackStore from "../../store/usePlaybackStore";

export default function PlaybackControls({
    notes = [],
}) {
    const {
        playing,
        play,
        pause,
        stop,
    } = usePlaybackStore();

    const handlePlay = async () => {
        if (!notes.length) return;

await playbackEngine.start();

playbackEngine.loadNotes(notes);

playbackEngine.play();

play();

    };

    const handlePause = () => {
        playbackEngine.stop();

pause();

    };

    const handleStop = () => {
        playbackEngine.stop();
stop();

    };

    return (<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"> <h2 className="text-xl font-bold mb-4">
        Playback Controls </h2>

        ```
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
