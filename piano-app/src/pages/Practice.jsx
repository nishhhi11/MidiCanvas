import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function Practice() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">Practice Session</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold">No Active Practice</h2>
            <p className="text-zinc-400 mt-3">Select a song from Learn Songs.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
