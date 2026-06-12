

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
