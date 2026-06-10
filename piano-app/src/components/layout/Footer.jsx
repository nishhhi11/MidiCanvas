export default function Footer() {
    return (
        <footer className="border-t border-zinc-800 mt-40">
            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div>
                        <h2 className="text-white text-2xl font-bold">
                            PIANO
                        </h2>

                        <p className="text-zinc-500 mt-2">
                            Learn piano with interactive lessons and AI-powered feedback.
                        </p>
                    </div>

                    <div className="flex gap-8 text-zinc-400">
                        <a href="#" className="hover:text-white transition">
                            Courses
                        </a>

                        <a href="#" className="hover:text-white transition">
                            Songs
                        </a>

                        <a href="#" className="hover:text-white transition">
                            Pricing
                        </a>

                        <a href="#" className="hover:text-white transition">
                            Contact
                        </a>
                    </div>

                </div>

                <div className="mt-10 pt-6 border-t border-zinc-800 text-center text-zinc-600 text-sm">
                    © 2026 PianoFlow. All rights reserved.
                </div>

            </div>
        </footer>
    );
  }