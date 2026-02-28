import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import GradientText from './GradientText';

const Home = ({ onNavigate }) => {
    return (
        <div className="w-full min-h-screen relative flex items-center justify-center overflow-hidden z-10">

            {/* Center Content */}
            <div className="relative z-20 flex flex-col items-center justify-center -mt-20 px-4 text-center">

                {/* Glow behind text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/40 blur-3xl rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center"
                >
                    {/* Badge */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-theme-border/50 bg-theme-bg/30 backdrop-blur-md mb-8">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                            <line x1="4" y1="4" x2="20" y2="20"></line>
                            <line x1="4" y1="20" x2="20" y2="4"></line>
                        </svg>
                        <span className="text-xs font-medium text-white/90">New Background</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-12 max-w-3xl">
                        <GradientText
                            colors={["#ffffff", "#8B929B", "#6CA2C8", "#34D399", "#ffffff"]}
                            animationSpeed={8}
                            showBorder={false}
                            className="w-full inline-block"
                        >
                            Unleash the shadows in the abyss of Dark Veil!
                        </GradientText>
                    </h1>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="px-8 py-3.5 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 active:scale-95 transition-transform"
                        >
                            Get Started
                        </button>

                        <button className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold tracking-wide hover:bg-white/10 hover:border-white/30 transition-all">
                            Learn More
                        </button>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default Home;
