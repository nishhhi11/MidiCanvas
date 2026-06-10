export function generateCoachReport(analyticsData, sessionData, previousAnalytics = null) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  const trends = [];

  const { averageReactionTime, perfectRate, missRate, lateHits, earlyHits } = analyticsData;
  const { accuracy, mode } = sessionData;

  // Trend Detection vs Last Session
  if (previousAnalytics) {
    const accuracyDiff = accuracy - (previousAnalytics.accuracy || accuracy); // fallback if missing
    if (accuracyDiff >= 5) trends.push(`📈 Accuracy improved by ${accuracyDiff}%`);
    else if (accuracyDiff <= -5) trends.push(`📉 Accuracy dropped by ${Math.abs(accuracyDiff)}%`);

    const reactionDiff = previousAnalytics.averageReactionTime - averageReactionTime;
    if (reactionDiff >= 15) trends.push(`📈 Reaction time improved by ${reactionDiff}ms`);
    else if (reactionDiff <= -15) trends.push(`📉 Reaction time slowed by ${Math.abs(reactionDiff)}ms`);

    const missDiff = missRate - previousAnalytics.missRate;
    if (missDiff > 5) trends.push(`📉 Miss rate increased slightly`);
    else if (missDiff < -5) trends.push(`📈 Miss rate improved significantly`);
  }

  // Evaluate Strengths & Weaknesses (Performance/Practice Mode)
  if (mode !== "wait") {
    if (perfectRate > 80) {
      strengths.push({ type: "accuracy", message: "Excellent note recognition and timing" });
    }

    if (averageReactionTime > 80) {
      weaknesses.push({ type: "timing", severity: "high", message: "Consistently playing late" });
      recommendations.push({ recommendation: "Focus on striking keys exactly as the block touches the red line.", confidence: 0.85 });
    } else if (averageReactionTime < -30) {
      weaknesses.push({ type: "timing", severity: "medium", message: "Rushing slightly ahead of the beat" });
      recommendations.push({ recommendation: "Relax and let the notes come to you.", confidence: 0.80 });
    }

    if (missRate > 20) {
      weaknesses.push({ type: "accuracy", severity: "high", message: "High frequency of missed notes" });
      recommendations.push({ recommendation: "Reduce playback tempo to 75% to practice transitions.", confidence: 0.95 });
    }

    if (lateHits > earlyHits * 2 && lateHits > 10) {
      strengths.push({ type: "pacing", message: "You don't rush the tempo" });
      weaknesses.push({ type: "pacing", severity: "medium", message: "Playing behind the beat" });
    }
  } 
  // Evaluate Wait Mode
  else {
    if (accuracy > 90) {
      strengths.push({ type: "accuracy", message: "Fantastic first-try chord and note recognition" });
      recommendations.push({ recommendation: "You are ready for Performance mode!", confidence: 0.90 });
    } else if (accuracy < 70) {
      weaknesses.push({ type: "accuracy", severity: "high", message: "Struggling with first-try inputs" });
      recommendations.push({ recommendation: "Keep practicing in Wait Mode to build muscle memory.", confidence: 0.85 });
    }
  }

  // Mastery Estimation
  let masteryEstimate = "Keep practicing!";
  if (accuracy >= 95) masteryEstimate = "Mastered! Try a harder song.";
  else if (accuracy >= 85) masteryEstimate = "1–2 more sessions to achieve mastery.";
  else if (accuracy >= 70) masteryEstimate = "3–4 sessions remaining.";
  else masteryEstimate = "Focus on small sections slowly.";

  return {
    createdAt: new Date().toISOString(),
    strengths,
    weaknesses,
    recommendations,
    trends,
    masteryEstimate
  };
}
