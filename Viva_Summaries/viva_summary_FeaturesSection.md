# FILE SUMMARY: src/components/landing/FeaturesSection.jsx

## Purpose
A static promotional section outlining the application's features for new users.

## React Concepts Used
- Rendering lists via `.map()`.
- Nested mapping (groups -> features).

## Most Likely Viva Questions
1. Why define this data array inside the component instead of outside?

## Expected Answers
1. Since it contains JSX elements (like the `<>` fragment in the Real-Time Audio Playback description), putting it outside the component is perfectly fine too, as it doesn't depend on state. However, keeping it inside groups the logic and data tightly. If we needed translation/i18n later, it would need to be inside to access hooks.
