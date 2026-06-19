# FILE SUMMARY: src/App.jsx

## Purpose
Configures the routes mapping URLs to Page components.

## React Concepts Used
- Routing (`react-router-dom`).

## Most Likely Viva Questions
1. Why do we use `BrowserRouter` instead of standard `<a>` tags?

## Expected Answers
1. Standard `<a>` tags cause the browser to do a full page refresh, losing all React state (like our Zustand stores). `BrowserRouter` intercepts URL changes and updates the React component tree seamlessly without reloading the HTML document, making it a true Single Page Application (SPA).
