export function evaluateAchievements(profile) {
  const achievements = new Set(profile.achievements || []);

  const { lifetimeStats, currentStreak } = profile;

  if (lifetimeStats?.songsCompleted >= 1) {
    achievements.add("first-song");
  }

  if (lifetimeStats?.songsCompleted >= 10) {
    achievements.add("ten-songs-completed");
  }

  if (currentStreak >= 3) {
    achievements.add("three-day-streak");
  }

  if (currentStreak >= 7) {
    achievements.add("seven-day-streak");
  }

  if (lifetimeStats?.bestAccuracy >= 95) {
    achievements.add("accuracy-95");
  }

  if (lifetimeStats?.bestAccuracy >= 100) {
    achievements.add("perfect-score");
  }

  return Array.from(achievements);
}
