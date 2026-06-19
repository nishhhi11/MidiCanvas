# FILE SUMMARY: src/hooks/useMidiParser.js

## Purpose
A custom React hook (`useMidiParser`) that orchestrates the flow of receiving a file, calling the Web Worker utility (`parseMidi`), and updating the global Zustand store (`useMidiStore`) with the result.

## Data Flow
Component `parse(file)` -> Hook calls `parseMidi(file)` -> Waits for Worker -> Hook calls `setMidiData(parsed)` -> Store updates.

## Important Variables
- `parse`: The memoized asynchronous function returned by the hook.

## Important Functions
- `useMidiParser`: The hook itself.

## React Concepts Used
- Custom Hooks (encapsulating logic that uses other hooks).
- `useCallback` (memoizing functions to prevent unnecessary re-renders).

## JavaScript Concepts Used
- Async/await inside a React Hook.
- Error handling with try/catch.

## Performance Considerations
- **`useCallback`:** Prevents referential instability of the returned `parse` function.
- **Zustand Selective Binding:** By only pulling out the setters (`setMidiData`, `setUploadedFile`), components that use this hook purely to *upload* a file won't unnecessarily re-render every time the playback changes the global `midiData`.

## Most Likely Viva Questions
1. What is the difference between a custom hook and a utility function?
2. Why is `useCallback` important here?
3. What happens if the `parseMidi` function throws an error?

## Tricky Follow-Up Questions
1. Can a regular JS function call `useMidiStore()`? 
2. What happens if the user uploads a corrupted file?

## Expected Answers
1. A custom hook can call other React hooks (like `useState`, `useEffect`, or store hooks). A standard utility function cannot.
2. It memoizes the `parse` function, keeping its memory address the same across re-renders. This prevents child components that receive `parse` as a prop from needlessly re-rendering.
3. The `try/catch` block catches the rejected Promise, logs an error to the console, and safely returns `null` without crashing the application.
4. *Follow-up 1:* Yes, Zustand actually allows fetching store state outside of React components using `useMidiStore.getState()`, but using it as a hook is standard within components.
5. *Follow-up 2:* The Web Worker's `midi.worker.js` try/catch block will fail, send `{success: false}` back, causing `parseMidi` to reject the Promise, which is then caught by this hook's catch block.
