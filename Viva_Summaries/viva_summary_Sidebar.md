# FILE SUMMARY: src/components/common/Sidebar.jsx

## Purpose
A sidebar component handling primary navigation and displaying the user's IndexedDB file library.

## Data Flow
Mount -> `fetchSavedFiles` -> `useLibraryStore` reads IndexedDB -> Updates `savedFiles` state -> Sidebar renders list.
Click File -> `handleLoadFile` fetches binary data -> `parseMidi` Web Worker -> `setMidiData` -> `navigate('/studio')`.

## React Concepts Used
- Inline components (`NavItem`).
- Programmatic navigation (`useNavigate`).

## Browser APIs Used
- `Blob` API for converting binary data arrays back into file-like objects for the parser.

## Most Likely Viva Questions
1. Why is `e.stopPropagation()` needed on the delete button?

## Expected Answers
1. The delete button is nested *inside* the file card `div`. The file card has an `onClick` handler that loads the file into the editor. If you click delete, the browser fires the button's click event, but then the event "bubbles up" and fires the card's click event too (loading the file you just tried to delete). `e.stopPropagation()` stops this bubbling, so *only* the delete action occurs.
