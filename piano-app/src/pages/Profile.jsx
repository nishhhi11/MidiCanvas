import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">Profile</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold">{user?.displayName || "Pianist"}</h2>
            <p className="text-zinc-400 mt-2">{user?.email}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
