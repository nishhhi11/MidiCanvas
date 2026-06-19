# FILE SUMMARY: src/components/library/FileCard.jsx

## Purpose
UI representation of a single file in the library, complete with metadata and action buttons.

## React Concepts Used
- Local state for dropdown toggle (`menuOpen`).
- Event bubbling prevention (`e.stopPropagation()`).

## Most Likely Viva Questions
1. What is the purpose of `e.stopPropagation()` in the dropdown menu?

## Expected Answers
1. If the dropdown menu sits inside a larger clickable card (or if clicking anywhere else triggers another action), clicking "Delete" would normally bubble up the DOM tree and trigger the parent's click handler too. `e.stopPropagation()` stops this event bubbling, ensuring only the delete action occurs.
