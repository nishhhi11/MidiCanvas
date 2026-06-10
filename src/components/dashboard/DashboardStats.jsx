import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/progressService";

export default function DashboardStats() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  if (!profile) return <div className="p-8 text-zinc-500">Loading Stats...</div>;

  const { lifetimeStats, currentStreak, level, achievements } = profile;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-orange-500 font-semibold mt-1">Level: {level}</p>
        </div>
        {achievements && achievements.length > 0 && (
          <div className="flex gap-2">
            {achievements.map(ach => (
              <div key={ach} className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {ach.replace(/-/g, " ")}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">🔥 Current Streak</p>
          <p className="text-3xl font-bold">{currentStreak} Days</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">🎹 Practice Time</p>
          <p className="text-3xl font-bold">{(lifetimeStats.totalPracticeMinutes / 60).toFixed(1)} Hrs</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">🎯 Avg Accuracy</p>
          <p className="text-3xl font-bold text-green-400">{lifetimeStats.averageAccuracy}%</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider">🎵 Songs Finished</p>
          <p className="text-3xl font-bold">{lifetimeStats.songsCompleted}</p>
        </div>
      </div>
    </div>
  );
}
