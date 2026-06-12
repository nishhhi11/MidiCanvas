import { BackgroundAnimations } from '../components/common/BackgroundAnimations';
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/common/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-main font-sans selection:bg-primary/30 relative">
            <BackgroundAnimations />
            <Navbar />

            <motion.main 
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CTASection />
            </motion.main>

            <Footer className="relative z-10" />
        </div>
    );
}
