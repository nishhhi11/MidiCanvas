import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function Learn() {
  const songs = [
    "Kesariya",
    "Tum Hi Ho",
    "Tujh Mein Rab Dikhta Hai",
    "Raabta",
    "Agar Tum Saath Ho",
    "Kal Ho Naa Ho",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-8">Learn Songs</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {songs.map((song) => (
              <div key={song} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold">{song}</h3>
                <button className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-black font-semibold">
                  Start Lesson
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
