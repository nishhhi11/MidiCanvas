/*
PURPOSE:
Provides math utilities to snap arbitrary time values to exact musical subdivisions based on the current tempo.

VIVA QUESTION:
How does `snapToGrid` work mathematically?

VIVA ANSWER:
It calculates the length of a single subdivision in seconds. It divides the note's original time by this length, rounds to the nearest whole integer (using `Math.round`), and multiplies it back by the length. This effectively forces the continuous time value to "snap" to the nearest discrete grid interval.
*/

export function snapToGrid(time, tempo, division) {
  if (division <= 0) return time; 
  const secondsPerBeat = 60 / tempo;
  const secondsPerDivision = secondsPerBeat * (4 / division);
  return Math.round(time / secondsPerDivision) * secondsPerDivision;
}

export function snapDuration(duration, tempo, division) {
  if (division <= 0) return duration;
  const secondsPerBeat = 60 / tempo;
  const secondsPerDivision = secondsPerBeat * (4 / division);
  const snapped = Math.round(duration / secondsPerDivision) * secondsPerDivision;
  // Ensure duration doesn't become 0
  return Math.max(secondsPerDivision, snapped);
}

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

/*
========================================
FILE SUMMARY
========================================

Purpose:
Pure mathematical functions to align continuous note timestamps to discrete musical intervals.

JavaScript Concepts Used:
- Floating-point math (`Math.round`, `Math.abs`, etc.).
- Array generation loop.
*/
