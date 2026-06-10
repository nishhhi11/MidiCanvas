import { useMidiStore } from "../../store/midiStore";
import { seek } from "../../services/playbackEngine";

export default function SectionSelector() {
  const { songSections, activeSection, setActiveSection, setLoopConfig, setCurrentTime } = useMidiStore();

  if (!songSections || songSections.length === 0) return null;

  const handleSectionSelect = (section) => {
    if (activeSection === section.id) {
      setActiveSection(null);
      setLoopConfig({ enabled: false });
    } else {
      setActiveSection(section.id);
      setLoopConfig({ start: section.start, end: section.end, enabled: true });
      seek(section.start);
      setCurrentTime(section.start);
    }
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-6">
      <p className="font-semibold text-lg mb-4">🎼 Section Practice</p>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {songSections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionSelect(section)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeSection === section.id 
                ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.4)]" 
                : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
}
