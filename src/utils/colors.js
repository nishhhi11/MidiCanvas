/*
PURPOSE:
A simple utility to provide consistent, visually distinct colors for different MIDI tracks.

VIVA QUESTION:
How does `getTrackColor` ensure it never runs out of colors, even if there are 50 tracks?

VIVA ANSWER:
It uses the modulo operator (`%`). By doing `trackId % DEFAULT_TRACK_COLORS.length`, it safely loops back to the beginning of the color array if the track index exceeds the available colors.
*/

export const DEFAULT_TRACK_COLORS = [
  '#a855f7', 
  '#3b82f6', 
  '#10b981', 
  '#f97316', 
  '#ec4899', 
  '#06b6d4', 
];

export function getTrackColor(trackId) {
  return DEFAULT_TRACK_COLORS[trackId % DEFAULT_TRACK_COLORS.length];
}

/*
========================================
FILE SUMMARY
========================================

Purpose:
A purely static utility module holding hexadecimal color tokens and a getter function.
*/
