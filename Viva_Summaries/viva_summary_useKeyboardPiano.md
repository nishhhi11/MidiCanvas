# FILE SUMMARY: src/hooks/useKeyboardPiano.js

## Purpose
A custom React hook that translates computer keyboard presses into musical MIDI notes.

## Data Flow
User presses 'A' -> `handleKeyDown` -> State updates `activeKeys` & `pressedNote` -> Hook returns new state -> Component using the hook triggers audio.

## Important Variables
- `activeKeys`: A Set of currently pressed MIDI numbers.
- `pressedNote`: The single most recently pressed note object.

## React Concepts Used
- `useEffect`: Event listener management and cleanup.
- `useCallback`: Memoizes the event handlers to prevent unnecessary re-renders or re-attachments in the `useEffect`.
- `useState`: Stores the pressed keys.

## Browser APIs Used
- `window.addEventListener('keydown', ...)`

## Most Likely Viva Questions
1. What does `e.repeat` do?
2. Why is `window.removeEventListener` important?

## Expected Answers
1. Operating systems send continuous `keydown` events when a key is held. `e.repeat` is a boolean flag indicating if the event is from this OS-level holding behavior. We ignore it so we don't trigger the synthesizer repeatedly.
2. If we navigate away from the page that uses this hook without removing the event listener, the browser keeps listening. If we come back, it attaches *another* listener. Pressing a key would then trigger the function twice, causing bugs and memory leaks.
