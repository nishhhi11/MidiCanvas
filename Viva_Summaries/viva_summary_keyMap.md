# FILE SUMMARY: src/components/editor/keyMap.js

## Purpose
Provides the mathematical layout logic for drawing an interactive virtual piano UI.

## JavaScript Concepts Used
- Array `.find()` and `.indexOf()`.
- Static JSON-like object arrays.

## Most Likely Viva Questions
1. Why do we calculate the position of a black key based on the white key next to it?

## Expected Answers
1. Because musically, a black key sits exactly between two white keys. By first calculating the percentage width of a white key (`100% / 14 = ~7.14%`), we can find the right edge of the preceding white key. We then set the black key's left position to that edge minus half of the black key's width, perfectly centering it over the crack between the two white keys.
