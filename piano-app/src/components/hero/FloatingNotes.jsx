import { motion } from "framer-motion";

export default function FloatingNotes() {
    return (
        <>
            <motion.div
                className="absolute right-20 top-20 text-8xl text-white/10 select-none"
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 8, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                ♪
            </motion.div>

            <motion.div
                className="absolute right-40 top-52 text-7xl text-white/10 select-none"
                animate={{
                    y: [0, -40, 0],
                    rotate: [0, -8, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                ♫
            </motion.div>

            <motion.div
                className="absolute right-28 top-96 text-5xl text-white/10 select-none"
                animate={{
                    y: [0, -25, 0],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                ♩
            </motion.div>
        </>
    );
}