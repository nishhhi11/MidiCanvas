import { motion } from "framer-motion";
import HeroContent from "./HeroContent";
import LaptopDemo from "./LaptopDemo";
import AmbientGlow from "./AmbientGlow";

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen pt-40 overflow-hidden bg-transparent">

            <AmbientGlow />

            <motion.div
                className="relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                >
                    <HeroContent />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-purple-600/30 blur-[140px]" />

                        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-pink-600/20 blur-[140px]" />

                        <div className="absolute top-40 right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[120px]" />
                    </div>
                </motion.div>

                <motion.div
                    className="relative"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        delay: 0.3,
                        duration: 1,
                        ease: "easeOut",
                    }}
                >
                    <LaptopDemo />
                    
                    <div className="absolute right-20 top-40 text-6xl opacity-20 animate-bounce">
                      🎵
                    </div>

                    <div className="absolute left-20 bottom-20 text-5xl opacity-20 animate-pulse">
                      🎶
                    </div>

                    <div className="absolute right-40 bottom-40 text-4xl opacity-20 animate-bounce">
                      ♫
                    </div>
                </motion.div>
            </motion.div>

        </section>
    );
}