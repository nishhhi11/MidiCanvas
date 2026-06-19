import { Link } from "react-router-dom";

/*
PURPOSE:
Renders the standard website footer containing links, branding, and copyright info.

REACT CONCEPT:
Pure presentational/dumb component.

VIVA QUESTION:
Why use `<Link>` from `react-router-dom` instead of a standard HTML `<a>` tag for internal links?

VIVA ANSWER:
Using an `<a>` tag causes the browser to completely reload the page. Since React is a Single Page Application (SPA), we want to avoid full page reloads to maintain state (like the audio engine or uploaded files). `<Link>` intercepts the click, updates the URL via the HTML5 History API, and tells React Router to swap out the components instantly without a browser reload.
*/
export default function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-border bg-bg-primary text-xs text-text-muted">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2 font-bold text-text-main text-sm">
                        <span>🎹</span> MIDI Canvas Studio
                    </div>
                    <p className="text-[10px]">Parse. Visualize. Edit. Playback.</p>
                </div>

                <div className="flex items-center gap-6 font-medium">
                    <Link to="/studio" className="hover:text-primary transition-colors">Editor</Link>
                    <Link to="/library" className="hover:text-primary transition-colors">Library</Link>
                    {/* Note: External links still use <a> tags with target="_blank" */}
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                        GitHub <span className="text-[10px] text-yellow-500">★ Star</span>
                    </a>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1 text-[10px]">
                    <p>Built with React • Web Audio API • IndexedDB</p>
                    <p>© 2026 Open Source MIT License</p>
                </div>

            </div>
        </footer>
    );
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A simple UI component that displays the application footer.

React Concepts Used:
- `react-router-dom`'s `<Link>` component for SPA navigation.

Most Likely Viva Questions:
1. What does `rel="noreferrer"` do on the external link?

Expected Answers:
1. It is a security and privacy measure. When opening an external site in a new tab (`target="_blank"`), `noreferrer` prevents the new page from knowing where the user came from (hides the Referer header). In older browsers, it also implicitly acted as `noopener`, preventing the external page from accessing the `window.opener` object to maliciously manipulate our app's original tab.
*/