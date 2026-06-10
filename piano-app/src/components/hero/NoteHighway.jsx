import { motion } from "framer-motion";

export default function NoteHighway() {
    return (
        <div className="absolute left-1/2 top-28 -translate-x-1/2">
            <div className="relative h-[360px] w-[420px] overflow-hidden rounded-3xl border border-white/5 bg-black/40">

                <motion.div
                    className="absolute left-[60px] h-20 w-5 rounded-full bg-blue-500 blur-[1px]"
                    animate={{
                        y: [-100, 400],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <motion.div
                    className="absolute left-[140px] h-24 w-5 rounded-full bg-violet-500 blur-[1px]"
                    animate={{
                        y: [-120, 420],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5,
                    }}
                />

                <motion.div
                    className="absolute left-[260px] h-20 w-5 rounded-full bg-pink-500 blur-[1px]"
                    animate={{
                        y: [-140, 400],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1,
                    }}
                />
            </div>
        </div>
    );
}