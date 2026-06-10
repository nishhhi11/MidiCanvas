import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

import PianoKeyboard from "../components/hero/PianoKeyboard";
import NoteHighway from "../components/hero/NoteHighway";
import FloatingNotes from "../components/hero/FloatingNotes";

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    const googleSignup = async () => {
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
                        Create Account
                    </h1>

                    <p className="text-zinc-400 text-center mt-3 mb-8">
                        Start your piano journey today.
                    </p>

                    <form
                        onSubmit={handleSignup}
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
                            Create Account
                        </button>
                    </form>

                    <button
                        onClick={googleSignup}
                        className="w-full mt-4 p-4 rounded-xl border border-zinc-700 text-white"
                    >
                        Continue with Google
                    </button>

                    <p className="text-center text-zinc-500 mt-8">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-white"
                        >
                            Sign In
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}