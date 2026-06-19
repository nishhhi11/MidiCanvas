import { BackgroundAnimations } from '../components/common/BackgroundAnimations';
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/common/Footer";

/*
PURPOSE:
The root component for the application's marketing/landing page. It stitches together various presentational sections.

REACT CONCEPT:
Composition and Presentational Components.

VIVA QUESTION:
Why do we wrap the `<main>` tag in a `framer-motion` `<motion.main>` component?

VIVA ANSWER:
This allows us to easily declare mount/unmount animations (like fading in and sliding up) directly via props (`initial`, `animate`, `transition`) without having to write complex CSS keyframe animations and intersection observers manually.
*/
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

/*
========================================
FILE SUMMARY
========================================

Purpose:
Serves as the visual entry point for the application, composing the landing page sections.
*/
