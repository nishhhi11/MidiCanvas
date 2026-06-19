# FILE SUMMARY: src/components/common/ThemeProvider.jsx

## Purpose
Manages the visual theme (Dark vs Light mode) of the application, syncing it with user preferences in `localStorage` and OS-level system preferences.

## Data Flow
User clicks Theme Toggle -> `useTheme().setTheme('dark')` -> Updates Context State -> Updates `localStorage` -> `useEffect` runs -> Modifies `<html class="dark">` DOM -> CSS variables change.

## React Concepts Used
- React Context API (`createContext`, `Context.Provider`, `useContext`).
- Lazy initial state in `useState(() => ...)` so we only read `localStorage` on the very first render, not every render.

## Browser APIs Used
- `localStorage` for persistence across page reloads.
- `window.matchMedia` for reading the OS system theme preferences.
- `window.document.documentElement.classList` for manipulating CSS classes on the root HTML tag.

## Most Likely Viva Questions
1. Why is the initial state of `useState` passed as an arrow function?
2. What does `window.matchMedia` do?

## Expected Answers
1. `localStorage.getItem` is a synchronous, blocking operation that can be slow. By passing an arrow function to `useState`, React treats it as "lazy initialization". It will only execute that function once during the initial mount, instead of running `localStorage.getItem` on every single re-render of the provider.
2. `window.matchMedia` allows JavaScript to evaluate CSS media queries. In this case, we use `(prefers-color-scheme: dark)` to check if the user's Windows or macOS system is currently set to dark mode.
