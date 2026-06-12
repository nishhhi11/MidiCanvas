// Default hex colors matching the previous Tailwind CSS colors:
// blue, emerald, pink, orange, purple, cyan

export const DEFAULT_TRACK_COLORS = [
  '#a855f7', // purple-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
];

export function getTrackColor(trackId) {
  return DEFAULT_TRACK_COLORS[trackId % DEFAULT_TRACK_COLORS.length];
}
