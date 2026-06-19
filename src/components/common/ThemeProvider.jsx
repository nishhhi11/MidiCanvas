import { createContext, useContext, useEffect, useState } from "react";

/*
PURPOSE:
Creates a React Context to hold the global theme state (dark/light/system).

REACT CONCEPT:
Context API (Used to avoid prop-drilling).
*/
const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

/*
PURPOSE:
A Wrapper component that sits near the top of the app tree. It provides the theme state to all children, and handles syncing the theme with CSS and localStorage.
*/
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // Initialize state from localStorage if it exists, otherwise use default
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  /*
  PURPOSE:
  Fires whenever `theme` changes. Updates the HTML DOM classes so that CSS variable overrides (like --bg-primary) take effect.
  */
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      // Check the operating system's dark mode preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // The object exposed to all components consuming this context
  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/*
PURPOSE:
A custom hook that makes it easy for any component to grab the theme and the `setTheme` function.
*/
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

/*
========================================
FILE SUMMARY
========================================

Purpose:
Manages the visual theme (Dark vs Light mode) of the application, syncing it with user preferences in `localStorage` and OS-level system preferences.

Data Flow:
User clicks Theme Toggle -> `useTheme().setTheme('dark')` -> Updates Context State -> Updates `localStorage` -> `useEffect` runs -> Modifies `<html class="dark">` DOM -> CSS variables change.

React Concepts Used:
- React Context API (`createContext`, `Context.Provider`, `useContext`).
- Lazy initial state in `useState(() => ...)` so we only read `localStorage` on the very first render, not every render.

Browser APIs Used:
- `localStorage` for persistence across page reloads.
- `window.matchMedia` for reading the OS system theme preferences.
- `window.document.documentElement.classList` for manipulating CSS classes on the root HTML tag.

Most Likely Viva Questions:
1. Why is the initial state of `useState` passed as an arrow function?
2. What does `window.matchMedia` do?

Expected Answers:
1. `localStorage.getItem` is a synchronous, blocking operation that can be slow. By passing an arrow function to `useState`, React treats it as "lazy initialization". It will only execute that function once during the initial mount, instead of running `localStorage.getItem` on every single re-render of the provider.
2. `window.matchMedia` allows JavaScript to evaluate CSS media queries. In this case, we use `(prefers-color-scheme: dark)` to check if the user's Windows or macOS system is currently set to dark mode.
*/
