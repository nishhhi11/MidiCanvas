export default function Testimonials() {
    const reviews = [
        {
            name: "Sarah Johnson",
            role: "Beginner Pianist",
            review:
                "I learned my first complete song in just 2 weeks. The visual lessons are incredible.",
        },
        {
            name: "Michael Chen",
            role: "Music Student",
            review:
                "The AI feedback helped me improve timing faster than traditional lessons.",
        },
        {
            name: "Emma Williams",
            role: "Hobby Musician",
            review:
                "Beautiful interface, amazing song library, and super motivating progress tracking.",
        },
    ];

    return (
        <section className="py-40 px-6 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <p className="text-cyan-400 uppercase tracking-widest text-sm">
                        Testimonials
                    </p>

                    <h2 className="text-5xl font-bold text-white mt-4">
                        Loved By
                        <br />
                        Thousands Of Learners
                    </h2>

                    <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
                        Join students around the world improving their piano skills every day.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-cyan-500/40 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent" />

                            <div className="relative">
                                <div className="flex gap-1 text-yellow-400 text-xl mb-6">
                                    ★★★★★
                                </div>

                                <p className="text-zinc-300 leading-relaxed mb-8">
                                    "{review.review}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />

                                    <div>
                                        <h4 className="text-white font-semibold">
                                            {review.name}
                                        </h4>

                                        <p className="text-zinc-500 text-sm">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
  }