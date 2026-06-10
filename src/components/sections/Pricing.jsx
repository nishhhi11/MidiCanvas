export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for getting started.",
            features: [
                "5 lessons",
                "Basic song library",
                "Progress tracking",
                "Community access",
            ],
            highlighted: false,
        },
        {
            name: "Pro",
            price: "$19",
            description: "Best for serious learners.",
            features: [
                "Unlimited lessons",
                "Full song library",
                "AI feedback",
                "Advanced analytics",
                "Offline mode",
            ],
            highlighted: true,
        },
        {
            name: "Team",
            price: "$49",
            description: "For schools and music groups.",
            features: [
                "Everything in Pro",
                "Teacher dashboard",
                "Student management",
                "Group analytics",
                "Priority support",
            ],
            highlighted: false,
        },
    ];

    return (
        <section
            id="pricing"
            className="py-40 px-6 bg-black"
        >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <p className="text-green-400 uppercase tracking-widest text-sm">
                        Pricing
                    </p>

                    <h2 className="text-5xl font-bold text-white mt-4">
                        Simple Pricing
                        <br />
                        For Every Musician
                    </h2>

                    <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
                        Choose a plan that matches your learning goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                                relative
                                rounded-3xl
                                border
                                p-8
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                ${plan.highlighted
                                    ? "border-green-500 bg-green-500/5"
                                    : "border-zinc-800 bg-zinc-950"
                                }
                            `}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold text-sm">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <h3 className="text-white text-2xl font-bold">
                                {plan.name}
                            </h3>

                            <p className="text-zinc-500 mt-2">
                                {plan.description}
                            </p>

                            <div className="mt-8">
                                <span className="text-5xl font-bold text-white">
                                    {plan.price}
                                </span>

                                <span className="text-zinc-500">
                                    /month
                                </span>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="text-zinc-300 flex items-center gap-3"
                                    >
                                        <span className="text-green-400">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`
                                    w-full
                                    mt-10
                                    py-4
                                    rounded-xl
                                    font-semibold
                                    transition
                                    ${plan.highlighted
                                        ? "bg-green-500 text-black hover:bg-green-400"
                                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    }
                                `}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}