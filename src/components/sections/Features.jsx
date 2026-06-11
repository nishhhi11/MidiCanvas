import { motion } from "framer-motion";

export default function Features() {
    const features = [
        {
            title: "AI Feedback",
            description:
                "Get instant feedback on timing, rhythm, and accuracy while you play.",
        },
        {
            title: "Interactive Lessons",
            description:
                "Learn step-by-step with guided exercises designed for every level.",
        },
        {
            title: "Real Songs",
            description:
                "Play your favorite songs with animated notes and live visual guidance.",
        },
        {
            title: "Progress Tracking",
            description:
                "Track improvement, streaks, achievements, and lesson completion.",
        },
    ];

    return (
        <section
            id="features"
            className="relative py-40 px-6 bg-transparent"
        >
            <div className="max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-blue-400 uppercase tracking-widest text-sm">
                        Features
                    </p>

                    <h2 className="text-5xl font-bold text-white mt-4">
                        Everything You Need
                        <br />
                        To Master Piano
                    </h2>

                    <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
                        Learn faster with AI-powered lessons, interactive feedback,
                        real songs, and beautiful visualizations.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.03,
                            }}
                            className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 hover:border-blue-500/40 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6" />

                            <h3 className="text-white text-2xl font-semibold mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}