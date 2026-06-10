import { motion } from "framer-motion";

export default function PianoKeyboard() {
    const whiteKeys = Array.from({ length: 24 });

    const blackKeyPositions = [
        4, 8,
        16, 20, 24,
        36, 40,
        48, 52, 56,
        68, 72,
        80, 84, 88,
    ];

    return (
        <div className="absolute bottom-0 left-1/2 h-[120px] w-[90%] -translate-x-1/2">

            <div className="flex h-full overflow-hidden rounded-b-xl shadow-2xl">
                {whiteKeys.map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 border-r border-zinc-300 bg-white"
                        animate={
                            i % 4 === 0
                                ? {
                                    backgroundColor: [
                                        "#ffffff",
                                        "#dbeafe",
                                        "#ffffff",
                                    ],
                                }
                                : {}
                        }
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>

            <div className="pointer-events-none absolute inset-0">
                {blackKeyPositions.map((left, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-b-md bg-black shadow-xl"
                        style={{
                            left: `${left}%`,
                            width: "3%",
                            height: "65px",
                            transform: "translateX(-50%)",
                        }}
                        animate={{
                            y: [0, 2, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}