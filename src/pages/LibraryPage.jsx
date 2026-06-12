import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import SavedFilesList from "../components/library/SavedFilesList";
import { useLibraryStore } from "../stores/libraryStore";
import { useMidiStore } from "../stores/midiStore";
import { parseMidi } from "../utils/midiParser";
import { BackgroundAnimations } from '../components/common/BackgroundAnimations';
import { Search, HardDrive, FileAudio, Calendar, Activity, Database, Upload } from "lucide-react";

export default function LibraryPage() {
    const navigate = useNavigate();
    const { savedFiles, deleteFile, getFileRawData } = useLibraryStore();
    const { setMidiData, setUploadedFile } = useMidiStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");

    const totalFiles = savedFiles.length;
    const totalSizeMB = (savedFiles.reduce((acc, f) => acc + (f.size || 0), 0) / (1024 * 1024)).toFixed(2);
    const totalNotes = savedFiles.reduce((acc, f) => acc + (f.noteCount || 0), 0);
    const lastBackup = savedFiles.length > 0 ? new Date(Math.max(...savedFiles.map(f => f.uploadedAt))).toLocaleDateString() : "Never";

    const filteredFiles = useMemo(() => {
        let files = [...savedFiles];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            files = files.filter(f => f.name.toLowerCase().includes(query));
        }

        switch (sortBy) {
            case "name":
                files.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "size":
                files.sort((a, b) => (b.size || 0) - (a.size || 0));
                break;
            case "tracks":
                files.sort((a, b) => b.trackCount - a.trackCount);
                break;
            case "date":
            default:
                files.sort((a, b) => b.uploadedAt - a.uploadedAt);
                break;
        }
        return files;
    }, [savedFiles, searchQuery, sortBy]);

    const handleLoadFile = async (file) => {
        try {
            const rawData = await getFileRawData(file.id);
            if (!rawData) return;
            const blob = new Blob([rawData], { type: 'audio/midi' });
            const parsed = await parseMidi(blob);
            setUploadedFile(file.name);
            setMidiData(parsed);
            navigate("/studio");
        } catch (err) {
            console.error("Failed to load saved file", err);
        }
    };

    const handleExport = async (file) => {
        try {
            const rawData = await getFileRawData(file.id);
            if (!rawData) return;
            const blob = new Blob([rawData], { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export file", err);
        }
    };

    const triggerUpload = () => {

        navigate("/studio");
    };

    return (
        <div className="min-h-screen bg-bg-primary text-[#FFFFF0] flex flex-col relative">
            <BackgroundAnimations />
            <Navbar />

            <main className="flex-1 overflow-y-auto pb-32 pt-28 px-6 relative z-10">
                <div className="max-w-[1400px] mx-auto space-y-8">

                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#FFFFF0]/10 pb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">💾</span>
                                <h1 className="text-4xl font-black tracking-tight text-[#FFFFF0]">
                                    My MIDI Library
                                </h1>
                            </div>
                            <p className="text-[#999999] text-lg">Your saved projects live here — forever in your browser.</p>
                        </div>
                        <button 
                            onClick={triggerUpload}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFF0] text-[#050505] hover:scale-105 font-bold uppercase tracking-wider ivory-glow transition-all"
                        >
                            <Upload size={18} />
                            Upload New
                        </button>
                    </header>

                    {savedFiles.length > 0 && (
                        <div className="flex items-center gap-4 glass-panel p-2 rounded-xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-transparent rounded-lg focus:outline-none focus:bg-[#FFFFF0]/5 transition-all text-[#FFFFF0] placeholder-[#999999] border border-transparent focus:border-[#FFFFF0]/20"
                                />
                            </div>
                            <div className="w-px h-6 bg-[#FFFFF0]/10" />
                            <div className="flex gap-4 pr-2">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2.5 bg-transparent focus:outline-none text-[#999999] hover:text-[#FFFFF0] cursor-pointer appearance-none min-w-[140px] border border-transparent focus:border-[#FFFFF0]/20 rounded-lg transition-all"
                                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFF0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem top 50%', backgroundSize: '0.65rem auto' }}
                                >
                                    <option value="date" className="bg-[#0D0D0D]">Sort by: Date</option>
                                    <option value="name" className="bg-[#0D0D0D]">Sort by: Name</option>
                                    <option value="size" className="bg-[#0D0D0D]">Sort by: Size</option>
                                    <option value="tracks" className="bg-[#0D0D0D]">Sort by: Tracks</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <SavedFilesList
                        files={filteredFiles}
                        onLoad={handleLoadFile}
                        onDelete={deleteFile}
                        onExport={handleExport}
                        hasFiles={savedFiles.length > 0}
                    />

                </div>
            </main>

            <div className="fixed bottom-0 left-0 w-full glass-panel border-b-0 border-x-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 h-8 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#999999]">
                    <div className="flex items-center gap-6">
                        <span>Projects: {totalFiles}</span>
                        <span>Tracks: {savedFiles.reduce((acc, f) => acc + (f.trackCount || 0), 0)}</span>
                        <span>Notes: {totalNotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span>Storage: {totalSizeMB} MB</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
