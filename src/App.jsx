import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LibraryPage from "./pages/LibraryPage";
import EditorPage from "./pages/EditorPage";

/*
PURPOSE:
The top-level React component that sets up Client-Side Routing for the entire application.

REACT CONCEPT:
Routing (`react-router-dom`).

VIVA QUESTION:
Why do we use `BrowserRouter` instead of standard `<a>` tags?

VIVA ANSWER:
Standard `<a>` tags cause the browser to do a full page refresh, losing all React state (like our Zustand stores). `BrowserRouter` intercepts URL changes and updates the React component tree seamlessly without reloading the HTML document, making it a true Single Page Application (SPA).
*/
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/studio" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
Configures the routes mapping URLs to Page components.
*/