/**
 * quantization.js
 * Grid-snapping math for the piano roll editor.
 */

/**
 * Snap a time value to the nearest grid division.
 * @param {number} time - time in seconds
 * @param {number} tempo - beats per minute
 * @param {number} division - grid division (e.g. 4 = quarter note, 8 = eighth, 16 = sixteenth)
 * @returns {number} snapped time in seconds
 */
export function snapToGrid(time, tempo, division) {
  if (division <= 0) return time; // snap off
  const secondsPerBeat = 60 / tempo;
  const secondsPerDivision = secondsPerBeat * (4 / division);
  return Math.round(time / secondsPerDivision) * secondsPerDivision;
}

/**
 * Snap a duration to the grid, ensuring a minimum of one division.
 * @param {number} duration - note duration in seconds
 * @param {number} tempo - beats per minute
 * @param {number} division - grid division
 * @returns {number} snapped duration (at least one grid unit)
 */
export function snapDuration(duration, tempo, division) {
  if (division <= 0) return duration;
  const secondsPerBeat = 60 / tempo;
  const secondsPerDivision = secondsPerBeat * (4 / division);
  const snapped = Math.round(duration / secondsPerDivision) * secondsPerDivision;
  return Math.max(secondsPerDivision, snapped);
}

/**
 * Calculate beat and measure grid lines for a given duration.
 * @param {number} duration - total duration in seconds
 * @param {number} tempo - beats per minute
 * @param {string} timeSignature - e.g. "4/4"
 * @returns {Array<{time: number, isMeasure: boolean}>}
 */
export function computeGridLines(duration, tempo = 120, timeSignature = '4/4') {
  const beatsPerSecond = tempo / 60;
  const secondsPerBeat = 1 / beatsPerSecond;
  const [beatsPerMeasure] = timeSignature.split('/').map(Number);
  const secondsPerMeasure = secondsPerBeat * beatsPerMeasure;

  const lines = [];
  for (let t = 0; t <= duration; t += secondsPerBeat) {
    const isMeasure = Math.abs(t % secondsPerMeasure) < 0.01;
    lines.push({ time: t, isMeasure });
  }
  return lines;
}
