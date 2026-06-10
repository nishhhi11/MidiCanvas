export function analyzeDifficulty(songData) {
    const {
        bpm,
        notesCount,
        highestNote,
        lowestNote,
        tracks,
    } = songData;

    const noteRange =
        highestNote - lowestNote;

    let score = 0;

    score += bpm * 0.03;
    score += notesCount * 0.002;
    score += noteRange * 0.08;
    score += tracks * 0.5;

    score = Math.min(score, 10);

    let level = "Beginner";

    if (score >= 3) level = "Easy";
    if (score >= 5) level = "Intermediate";
    if (score >= 7) level = "Advanced";
    if (score >= 9) level = "Expert";

    const reasons = [];

    if (bpm > 120)
        reasons.push("Fast tempo");

    if (noteRange > 40)
        reasons.push("Large hand movement");

    if (notesCount > 1000)
        reasons.push("High note density");

    if (tracks > 4)
        reasons.push("Multiple tracks");

    return {
        score: score.toFixed(1),
        level,
        reasons,
    };
}
    