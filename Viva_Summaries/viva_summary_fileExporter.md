# FILE SUMMARY: src/utils/fileExporter.js

## Purpose
Utility functions to repackage internal JSON state back into Standard MIDI File binary blobs and trigger downloads.

## JavaScript Concepts Used
- Blob (Binary Large Object).
- Object URLs (`URL.createObjectURL`).
- Programmatic DOM Manipulation (creating/clicking anchor tags).

## Most Likely Viva Questions
1. How do you trigger a file download purely on the client side without a server?

## Expected Answers
1. We create a `Blob` from the binary data and use `URL.createObjectURL(blob)` to generate a temporary internal URL. Then, we programmatically create an `<a>` (anchor) tag, set its `href` to that URL and its `download` attribute to the filename, append it to the document, call `.click()` on it to trigger the download, and immediately remove the tag. Finally, we call `URL.revokeObjectURL()` to free up browser memory.
