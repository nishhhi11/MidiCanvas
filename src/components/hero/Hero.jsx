import { motion } from "framer-motion";
import HeroContent from "./HeroContent";
import LaptopDemo from "./LaptopDemo";
import AmbientGlow from "./AmbientGlow";

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-40 overflow-hidden bg-black">

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
                </motion.div>

                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        delay: 0.3,
                        duration: 1,
                        ease: "easeOut",
                    }}
                >
                    <LaptopDemo />
                </motion.div>
            </motion.div>

        </section>
    );
}