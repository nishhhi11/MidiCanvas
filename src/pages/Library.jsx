import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function Library() {
  const recentSongs = [
    "Kesariya",
    "Tum Hi Ho",
    "Raabta",
    "Kal Ho Naa Ho",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">My Library</h1>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Recently Uploaded</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {recentSongs.map((song) => (
                <div key={song} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-semibold">{song}</h3>
                  <p className="text-zinc-500 text-sm mt-2">MIDI Available</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              No favorite songs yet.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
