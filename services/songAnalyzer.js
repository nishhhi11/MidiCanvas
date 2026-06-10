export function analyzeSong(parsedMidi) {
  const { tempo = 120, duration = 0, noteCount = 0 } = parsedMidi;

  // 1. Calculate Notes Per Second
  const notesPerSecond = duration > 0 ? noteCount / duration : 0;

  // 2. Tempo Contribution
  let tempoScore = 0;
  if (tempo >= 160) {
    tempoScore = 3;
  } else if (tempo >= 120) {
    tempoScore = 2;
  } else if (tempo >= 80) {
    tempoScore = 1;
  } else {
    tempoScore = 0;
  }

  // Calculate Base Score based on Notes Per Second
  let baseScore = 1;
  if (notesPerSecond > 8) {
    baseScore = 7;
  } else if (notesPerSecond >= 6) {
    baseScore = 5;
  } else if (notesPerSecond >= 4) {
    baseScore = 4;
  } else if (notesPerSecond >= 2) {
    baseScore = 2;
  } else {
    baseScore = 1;
  }

  // 3. Calculate Overall Difficulty Score (Capped at 10)
  const difficultyScore = Math.min(10, baseScore + tempoScore);

  // 4. Assign Final Difficulty Label based on Total Score
  let difficulty = "Beginner";
  if (difficultyScore >= 9) {
    difficulty = "Expert";
  } else if (difficultyScore >= 7) {
    difficulty = "Advanced";
  } else if (difficultyScore >= 5) {
    difficulty = "Intermediate";
  } else if (difficultyScore >= 3) {
    difficulty = "Easy";
  } else {
    difficulty = "Beginner";
  }

  return {
    notesPerSecond: Number(notesPerSecond.toFixed(2)),
    tempoScore,
    difficultyScore,
    difficulty,
  };
}
