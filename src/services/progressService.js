import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { evaluateAchievements } from "./achievementEngine";
import { generateCoachReport } from "./aiCoachService";
import { useMidiStore } from "../store/midiStore";

// Utility to get start of day for comparison
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const getCalendarDifference = (date1, date2) => {
  const day1 = getStartOfDay(date1);
  const day2 = getStartOfDay(date2);
  return Math.round((day1 - day2) / (1000 * 60 * 60 * 24));
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  // Default profile structure
  const defaultProfile = {
    displayName: "Piano Player",
    email: "",
    lifetimeStats: {
      sessionsPlayed: 0,
      songsCompleted: 0,
      totalPracticeMinutes: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalPerfectHits: 0,
      totalGoodHits: 0,
      totalMisses: 0
    },
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    level: "Beginner",
    achievements: []
  };

  await setDoc(docRef, defaultProfile);
  return defaultProfile;
};

export const getUserSessions = async (uid, count = 5) => {
  const sessionsRef = collection(db, "users", uid, "sessions");
  const q = query(sessionsRef, orderBy("createdAt", "desc"), limit(count));
  const querySnapshot = await getDocs(q);
  
  const sessions = [];
  querySnapshot.forEach((doc) => {
    sessions.push({ id: doc.id, ...doc.data() });
  });
  return sessions;
};

export const saveSession = async (uid, sessionData, hitHistory) => {
  const profile = await getUserProfile(uid);
  const now = new Date();
  
  // 1. Calculate Streak using Calendar Days
  let newStreak = profile.currentStreak;
  const lastDateStr = profile.lastPracticeDate;
  
  if (lastDateStr) {
    const diff = getCalendarDifference(now, new Date(lastDateStr));
    if (diff === 1) {
      newStreak += 1;
    } else if (diff > 1) {
      newStreak = 1;
    } // if diff === 0, keep same streak
  } else {
    newStreak = 1; // First ever session
  }

  // 2. Update Lifetime Stats
  const oldStats = profile.lifetimeStats;
  const totalNotes = sessionData.perfect + sessionData.good + sessionData.miss;
  
  const newPracticeMinutes = sessionData.practiceMinutes || 0;
  const totalPracticeMinutes = oldStats.totalPracticeMinutes + newPracticeMinutes;
  const sessionsPlayed = oldStats.sessionsPlayed + 1;
  const songsCompleted = oldStats.songsCompleted + 1; // Assuming completing a session is a song
  
  const totalPerfectHits = oldStats.totalPerfectHits + sessionData.perfect;
  const totalGoodHits = oldStats.totalGoodHits + sessionData.good;
  const totalMisses = oldStats.totalMisses + sessionData.miss;
  
  const bestAccuracy = Math.max(oldStats.bestAccuracy, sessionData.accuracy);
  
  // Running average accuracy
  const averageAccuracy = Math.round(
    ((oldStats.averageAccuracy * oldStats.sessionsPlayed) + sessionData.accuracy) / sessionsPlayed
  );

  const updatedLifetimeStats = {
    sessionsPlayed,
    songsCompleted,
    totalPracticeMinutes,
    averageAccuracy,
    bestAccuracy,
    totalPerfectHits,
    totalGoodHits,
    totalMisses
  };

  // 3. Compute Skill Level
  let level = "Beginner";
  if (totalPracticeMinutes >= 3000) level = "Expert";
  else if (totalPracticeMinutes >= 1000) level = "Advanced";
  else if (totalPracticeMinutes >= 300) level = "Intermediate";

  // 4. Evaluate Achievements
  const tempProfile = { ...profile, lifetimeStats: updatedLifetimeStats, currentStreak: newStreak };
  const newAchievements = evaluateAchievements(tempProfile);

  const updatedProfile = {
    ...profile,
    currentStreak: newStreak,
    longestStreak: Math.max(profile.longestStreak, newStreak),
    lastPracticeDate: now.toISOString(),
    lifetimeStats: updatedLifetimeStats,
    level,
    achievements: newAchievements
  };

  // 5. Compress Hit History for Analytics Collection
  let sumReactionTime = 0;
  let perfectCount = 0;
  let goodCount = 0;
  let missCount = 0;
  let earlyHits = 0;
  let lateHits = 0;

  hitHistory.forEach(hit => {
    sumReactionTime += hit.reactionTime;
    if (hit.result === "perfect") perfectCount++;
    else if (hit.result === "good") goodCount++;
    else missCount++;

    if (hit.actualTime < hit.expectedTime) earlyHits++;
    else if (hit.actualTime > hit.expectedTime) lateHits++;
  });

  const totalHits = hitHistory.length || 1; // avoid division by zero
  const analyticsData = {
    averageReactionTime: Math.round((sumReactionTime / totalHits) * 1000), // in ms
    perfectRate: Math.round((perfectCount / totalHits) * 100),
    goodRate: Math.round((goodCount / totalHits) * 100),
    missRate: Math.round((missCount / totalHits) * 100),
    lateHits,
    earlyHits,
    accuracy: sessionData.accuracy,
    createdAt: serverTimestamp()
  };

  // 6. Generate AI Coach Report
  // Fetch previous analytics to build trend data
  const analyticsQ = query(collection(db, "users", uid, "analytics"), orderBy("createdAt", "desc"), limit(1));
  const previousAnalyticsSnap = await getDocs(analyticsQ);
  let previousAnalytics = null;
  if (!previousAnalyticsSnap.empty) {
    previousAnalytics = previousAnalyticsSnap.docs[0].data();
  }

  const coachReport = generateCoachReport(analyticsData, sessionData, previousAnalytics);

  // Execute Batch Writes (Promises)
  const userRef = doc(db, "users", uid);
  const sessionRef = collection(db, "users", uid, "sessions");
  const analyticsRef = collection(db, "users", uid, "analytics");
  const coachRef = collection(db, "users", uid, "coachHistory");
  const songRef = doc(db, "users", uid, "songs", sessionData.songId || "unknown");

  await Promise.all([
    setDoc(userRef, updatedProfile),
    addDoc(sessionRef, {
      ...sessionData,
      createdAt: serverTimestamp()
    }),
    addDoc(analyticsRef, analyticsData),
    addDoc(coachRef, coachReport),
    setDoc(songRef, {
      songId: sessionData.songId || "unknown",
      bestAccuracy: sessionData.accuracy,
      bestGrade: sessionData.grade,
      attempts: 1, // simplified upsert
      completed: true
    }, { merge: true })
  ]);

  // Push Coach Report to global store for UI components (Modal/Dashboard)
  const store = useMidiStore.getState();
  store.setCoachHistory([coachReport, ...store.coachHistory]);

  return updatedProfile;
};
