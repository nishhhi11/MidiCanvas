import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function DashboardCoach() {
  const { user } = useAuth();
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchLatestReport = async () => {
        const q = query(collection(db, "users", user.uid, "coachHistory"), orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setLatestReport(snapshot.docs[0].data());
        }
        setLoading(false);
      };
      fetchLatestReport();
    }
  }, [user]);

  if (loading) return null;

  if (!latestReport) {
    return (
      <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="text-6xl">🎹</div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome to PianoFlow Coach!</h2>
          <p className="text-zinc-300">Upload or play your first song to receive personalized coaching insights.</p>
          <p className="text-zinc-400 text-sm mt-1">Complete a practice session and I'll start analyzing your strengths, weaknesses, and progress.</p>
        </div>
      </div>
    );
  }

  // Find most severe weakness or fallback
  const focusTarget = latestReport.weaknesses.length > 0 
    ? latestReport.weaknesses.reduce((prev, curr) => (prev.severity === 'high' ? prev : curr)) 
    : null;

  const topRecommendation = latestReport.recommendations.length > 0 
    ? latestReport.recommendations.reduce((prev, curr) => (prev.confidence > curr.confidence ? prev : curr)) 
    : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🎹 Today's Focus
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-black border border-zinc-800 p-6 rounded-xl">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Target Metric</p>
          {focusTarget ? (
            <div>
              <p className="text-xl font-bold text-orange-500">{focusTarget.type === "timing" ? "🎯 Timing Accuracy" : focusTarget.type === "accuracy" ? "🎯 Note Accuracy" : "🎯 Rhythmic Pacing"}</p>
              <p className="text-zinc-300 mt-2">{focusTarget.message}</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold text-green-400">✨ Maintain Consistency</p>
              <p className="text-zinc-300 mt-2">You are performing exceptionally well!</p>
            </div>
          )}
        </div>

        <div className="bg-black border border-zinc-800 p-6 rounded-xl">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Recommendation</p>
          {topRecommendation ? (
            <div>
              <p className="font-semibold text-lg">{topRecommendation.recommendation}</p>
              <p className="text-zinc-400 text-sm mt-4 italic">Estimated Mastery: {latestReport.masteryEstimate}</p>
            </div>
          ) : (
            <p className="text-zinc-400">Keep practicing steadily.</p>
          )}
        </div>
      </div>
    </div>
  );
}
