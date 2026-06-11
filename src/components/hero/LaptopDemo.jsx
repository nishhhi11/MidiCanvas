import { motion } from "framer-motion";
import NoteHighway from "./NoteHighway";
import PianoKeyboard from "./PianoKeyboard";
import FloatingNotes from "./FloatingNotes";

export default function LaptopDemo() {
    return (
        <div className="relative mt-20 flex justify-center px-6">

            <motion.div
                className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]"
                animate={{
                    opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                }}
            />

            <motion.div
                className="w-full max-w-[1200px]"
                animate={{
                    y: [0, -12, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.4,
                    }}
                    className="overflow-hidden rounded-t-[30px] border border-white/10 bg-zinc-900 shadow-[0_0_120px_rgba(255,255,255,0.08)]"
                >
                    <div className="flex h-12 items-center gap-2 bg-zinc-800 px-4">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>

                    <div className="relative h-[500px] bg-gradient-to-br from-zinc-900 via-black to-zinc-950">

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.8,
                                duration: 0.8,
                            }}
                            className="absolute left-10 top-10 z-20"
                        >
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Currently Learning
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-white">
                                Tum Hi Ho
                            </h2>

                            <p className="mt-3 text-zinc-400">
                                Progress: 78%
                            </p>

                            <div className="mt-4 h-2 w-56 overflow-hidden rounded-full bg-zinc-800">
                                <div className="h-full w-[78%] rounded-full bg-white" />
                            </div>
                        </motion.div>

                        <FloatingNotes />
                        <NoteHighway />
                        <PianoKeyboard />
                    </div>
                </motion.div>

                <motion.div
                    className="mx-auto h-5 w-[104%] rounded-b-full bg-gradient-to-b from-zinc-700 to-zinc-900"
                    animate={{
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </div>
    );
}