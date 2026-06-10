import { Link } from "react-router-dom";

const CTA = () => {
    const scrollToFeatures = () => {
        document
            .getElementById("features")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    return (
        <section className="relative py-32 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20" />

            <div className="relative max-w-5xl mx-auto text-center">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    Start Your Piano Journey
                </h2>

                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Learn faster with interactive lessons, real-time feedback,
                    and thousands of songs at your fingertips.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">

                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                        Start Free Trial
                    </Link>

                    <button
                        onClick={scrollToFeatures}
                        className="px-8 py-4 border border-zinc-700 text-white rounded-xl hover:bg-zinc-900 transition"
                    >
                        Watch Demo
                    </button>

                </div>
            </div>
        </section>
    );
};

export default CTA;