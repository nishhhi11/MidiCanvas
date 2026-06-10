export default function Hero() {
    return (
        <div className="rounded-3xl overflow-hidden relative h-72 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 p-10">

            <div className="relative z-10">
                <h1 className="text-5xl font-bold">
                    Learn Bollywood Songs
                </h1>

                <p className="mt-4 text-xl">
                    Turn any MIDI into a guided piano lesson.
                </p>

                <button className="mt-6 px-6 py-3 rounded-xl bg-black">
                    Start Learning
                </button>
            </div>

        </div>
    );
  }