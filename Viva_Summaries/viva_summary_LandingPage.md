# FILE SUMMARY: src/pages/LandingPage.jsx

## Purpose
Serves as the visual entry point for the application, composing the landing page sections.

## React Concepts Used
- Composition and Presentational Components.

## Most Likely Viva Questions
1. Why do we wrap the `<main>` tag in a `framer-motion` `<motion.main>` component?

## Expected Answers
1. This allows us to easily declare mount/unmount animations (like fading in and sliding up) directly via props (`initial`, `animate`, `transition`) without having to write complex CSS keyframe animations and intersection observers manually.
