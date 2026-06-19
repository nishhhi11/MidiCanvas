# FILE SUMMARY: src/main.jsx

## Purpose
Mounts the React Application to the `index.html` file and provides the top-level Theme context.

## React Concepts Used
- Mounting the root component, `StrictMode`, Context Providers.

## Most Likely Viva Questions
1. What does `<StrictMode>` actually do in React 18?

## Expected Answers
1. It is a development-only tool that highlights potential problems. Specifically, in development mode, it intentionally mounts, unmounts, and re-mounts components twice to help developers detect impure components, side-effect bugs in `useEffect`, and deprecated API usage. It does not affect production builds.
