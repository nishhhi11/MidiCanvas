import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./piano-app/src/context/AuthContext";

import Navbar from "./piano-app/src/components/layout/Navbar";
import Footer from "./piano-app/src/components/layout/Footer";

import Hero from "./piano-app/src/components/hero/Hero";
import Features from "./piano-app/src/components/sections/Features";
import SongLibrary from "./piano-app/src/components/sections/SongLibrary";
import Testimonials from "./piano-app/src/components/sections/Testimonials";
import Pricing from "./piano-app/src/components/sections/Pricing";
import CTA from "./piano-app/src/components/sections/CTA";

import Login from "./piano-app/src/pages/Login";
import Signup from "./piano-app/src/pages/Signup";
import Dashboard from "./piano-app/src/pages/Dashboard";
import Upload from "./piano-app/src/pages/Upload";
import Library from "./piano-app/src/pages/Library";
import Learn from "./piano-app/src/pages/Learn";
import Practice from "./piano-app/src/pages/Practice";
import Profile from "./piano-app/src/pages/Profile";

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