# FILE SUMMARY: src/utils/colors.js

## Purpose
A purely static utility module holding hexadecimal color tokens and a getter function.

## Most Likely Viva Questions
1. How does `getTrackColor` ensure it never runs out of colors, even if there are 50 tracks?

## Expected Answers
1. It uses the modulo operator (`%`). By doing `trackId % DEFAULT_TRACK_COLORS.length`, it safely loops back to the beginning of the color array if the track index exceeds the available colors.
