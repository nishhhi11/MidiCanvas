

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
