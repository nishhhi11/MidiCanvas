import { create } from "zustand";

const usePlaybackStore = create((set) => ({
    playing: false,

    play: () =>
        set({
            playing: true,
        }),

    pause: () =>
        set({
            playing: false,
        }),

    stop: () =>
        set({
            playing: false,
        }),
}));

export default usePlaybackStore;