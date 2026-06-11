import { motion } from "framer-motion";
import {
    Upload,
    Brain,
    Piano,
    TrendingUp,
} from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "Upload MIDI",
        description:
            "Upload any MIDI file of your favorite song.",
    },
    {
        icon: Brain,
        title: "AI Analysis",
        description:
            "PianoFlow analyzes notes, rhythm, and difficulty.",
    },
    {
        icon: Piano,
        title: "Interactive Lesson",
        description:
            "Learn with falling notes and visual piano guidance.",
    },
    {
        icon: TrendingUp,
        title: "Track Progress",
        description:
            "Improve accuracy, timing, and consistency.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-transparent">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <p className="text-purple-400 font-semibold uppercase tracking-wider">
                        HOW IT WORKS
                    </p>

                    <h2 className="text-5xl md:text-6xl font-bold text-white mt-4">
                        Learn Piano In
                        <span className="text-purple-400">
                            {" "}4 Simple Steps
                        </span>
                    </h2>

                    <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
                        From Bollywood hits to classical masterpieces,
                        PianoFlow transforms songs into interactive lessons.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.15,
                            }}
                            viewport={{ once: true }}
                            className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center mb-6">
                                <step.icon className="w-8 h-8 text-purple-400" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">
                                {step.title}
                            </h3>

                            <p className="text-gray-400">
                                {step.description}
                            </p>

                            <div className="absolute top-4 right-4 text-purple-500 text-4xl font-bold opacity-20">
                                {index + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}