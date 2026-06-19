# FILE SUMMARY: src/utils/quantization.js

## Purpose
Pure mathematical functions to align continuous note timestamps to discrete musical intervals.

## JavaScript Concepts Used
- Floating-point math (`Math.round`, `Math.abs`, etc.).
- Array generation loop.

## Most Likely Viva Questions
1. How does `snapToGrid` work mathematically?

## Expected Answers
1. It calculates the length of a single subdivision in seconds. It divides the note's original time by this length, rounds to the nearest whole integer (using `Math.round`), and multiplies it back by the length. This effectively forces the continuous time value to "snap" to the nearest discrete grid interval.
