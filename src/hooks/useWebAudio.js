/*
PURPOSE:
An alias/re-export file. It exports `usePlaybackController` from `usePlayback.js`.

WHY IT EXISTS:
This is an architectural convenience. It allows components to import from `useWebAudio` if the name makes more semantic sense in their specific context, while pointing to the same underlying hook.
*/
export { usePlaybackController } from './usePlayback';