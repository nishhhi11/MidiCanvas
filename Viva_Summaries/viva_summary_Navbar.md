# FILE SUMMARY: src/components/common/Navbar.jsx

## Purpose
A persistent navigation header that sits at the top of the application pages (Landing, Library).

## Data Flow
`useLocation` reads URL -> React updates UI to highlight active link.
Click Theme Toggle -> Context Updates -> DOM `<html class="dark/light">` updates -> CSS Variables Change.

## React Concepts Used
- `useLocation` hook from React Router to conditionally apply CSS classes.
- Consuming React Context (`useTheme`).

## Most Likely Viva Questions
1. How does the active link highlight work?

## Expected Answers
1. We use the `useLocation` hook from `react-router-dom` to get the current pathname (e.g., `/studio`). When rendering the array of links using `.map()`, we check if `location.pathname === path`. If it's true, we dynamically inject a specific CSS class to highlight that link and render a small underline `span`.
