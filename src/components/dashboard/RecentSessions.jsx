import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserSessions } from "../../services/progressService";

export default function RecentSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user) {
      getUserSessions(user.uid, 5).then(setSessions);
    }
  }, [user]);

  if (!sessions.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center">
        <h2 className="text-xl font-bold mb-2">Recent Sessions</h2>
        <p className="text-zinc-500">No sessions recorded yet. Play a song to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Recent Sessions</h2>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-black border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={session.songThumbnail || "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=100&h=100"} 
                alt="Thumbnail" 
                className="w-16 h-16 rounded-lg object-cover" 
              />
              <div>
                <h3 className="font-bold text-lg">{session.songName}</h3>
                <p className="text-zinc-400 text-sm">
                  {session.createdAt?.toDate().toLocaleDateString()} • {session.mode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-zinc-500 text-xs uppercase">Accuracy</p>
                <p className="font-bold text-lg">{session.accuracy}%</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-500 text-xs uppercase">Grade</p>
                <p className={`font-bold text-2xl ${
                  session.grade === 'S' ? 'text-orange-500' :
                  session.grade === 'A' ? 'text-green-400' :
                  'text-white'
                }`}>{session.grade}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
