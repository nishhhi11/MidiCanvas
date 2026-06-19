import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App";
import { ThemeProvider } from "./components/common/ThemeProvider";

/*
PURPOSE:
The absolute entry point of the React application. It attaches the React tree to the HTML DOM.

REACT CONCEPT:
Mounting the root component, `StrictMode`, Context Providers.

VIVA QUESTION:
What does `<StrictMode>` actually do in React 18?

VIVA ANSWER:
It is a development-only tool that highlights potential problems. Specifically, in development mode, it intentionally mounts, unmounts, and re-mounts components twice to help developers detect impure components, side-effect bugs in `useEffect`, and deprecated API usage. It does not affect production builds.
*/
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
        </ThemeProvider>
    </StrictMode>
);

/*
========================================
FILE SUMMARY
========================================

Purpose:
Mounts the React Application to the `index.html` file and provides the top-level Theme context.
*/