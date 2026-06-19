# FILE SUMMARY: src/components/library/SavedFilesList.jsx

## Purpose
A container component that takes the raw array of IndexedDB files, sorts/filters them into categories, and maps them into `FileCard` components.

## React Concepts Used
- Conditional rendering for empty states.
- Array manipulation (filter, sort, slice).

## Most Likely Viva Questions
1. Why do you spread `[...otherFiles]` before calling `.sort()`?

## Expected Answers
1. In JavaScript, `.sort()` mutates the original array in place. If I didn't create a shallow copy using the spread operator `[...otherFiles]`, I would be rearranging the actual source array, which could cause unintended side-effects elsewhere in the UI that rely on the original order.
