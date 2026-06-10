import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const item = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
        },
    },
};

export default function HeroContent() {
    const scrollToFeatures = () => {
        document
            .getElementById("features")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    return (
        <motion.div
            className="text-center"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm mb-8">
                    🎹 AI Powered Piano Learning
                </span>
            </motion.div>

            <motion.h1
                variants={item}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none"
            >
                Master Piano
                <br />
                <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                    One Note At A Time
                </span>
            </motion.h1>

            <motion.p
                variants={item}
                className="mt-8 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
                Play your favorite songs with interactive lessons,
                falling notes, and instant feedback that helps you
                improve faster every day.
            </motion.p>

            <motion.div
                variants={item}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
                <Link to="/signup">
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="px-8 py-4 rounded-full bg-white text-black font-semibold"
                    >
                        Start Free
                    </motion.button>
                </Link>

                <motion.button
                    whileHover={{
                        scale: 1.05,
                        y: -2,
                    }}
                    whileTap={{
                        scale: 0.97,
                    }}
                    onClick={scrollToFeatures}
                    className="px-8 py-4 rounded-full border border-zinc-700 text-white backdrop-blur-sm"
                >
                    Watch Demo
                </motion.button>
            </motion.div>
        </motion.div>
    );
}