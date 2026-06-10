import { useState } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

import PianoKeyboard from "../components/hero/PianoKeyboard";
import NoteHighway from "../components/hero/NoteHighway";
import FloatingNotes from "../components/hero/FloatingNotes";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth, provider);

            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">

            <div className="absolute inset-0">
                <FloatingNotes />
                <NoteHighway />
                <PianoKeyboard />
            </div>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl p-8">

                    <Link
                        to="/"
                        className="block text-center text-3xl font-bold text-white mb-8"
                    >
                        PIANO
                    </Link>

                    <h1 className="text-4xl font-bold text-white text-center">
                        Welcome Back
                    </h1>

                    <p className="text-zinc-400 text-center mt-3 mb-8">
                        Continue your piano journey.
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                        />

                        <button
                            type="submit"
                            className="w-full p-4 rounded-xl bg-white text-black font-semibold"
                        >
                            Sign In
                        </button>
                    </form>

                    <button
                        onClick={googleLogin}
                        className="w-full mt-4 p-4 rounded-xl border border-zinc-700 text-white"
                    >
                        Continue with Google
                    </button>

                    <p className="text-center text-zinc-500 mt-8">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-white"
                        >
                            Create Account
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}