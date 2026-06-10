import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/hero/Hero";
import Features from "./components/sections/Features";
import SongLibrary from "./components/sections/SongLibrary";
import Testimonials from "./components/sections/Testimonials";
import Pricing from "./components/sections/Pricing";
import CTA from "./components/sections/CTA";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Library from "./pages/Library";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Profile from "./pages/Profile";

function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <SongLibrary />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/library" element={<Library />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}