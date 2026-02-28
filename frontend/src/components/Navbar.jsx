import React from 'react';
import { Zap, Bell } from 'lucide-react';

const Navbar = ({ status, currentRoute, onNavigate }) => {
    return (
        <div className="w-full flex justify-center pt-6 px-4 absolute top-0 z-50 pointer-events-none">
            <nav className="w-full max-w-4xl px-6 py-4 flex items-center justify-between bg-theme-bg/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto transition-all">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onNavigate('home')}
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Zap size={16} className="text-white" fill="currentColor" />
                    </div>
                    <h1 className="text-lg font-bold tracking-[0.15em] text-white mr-4">Beat Bits</h1>
                </div>

                {/* Navigation Options */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => onNavigate('home')}
                        className={`text-sm font-semibold tracking-wide transition-colors relative ${currentRoute === 'home' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                        Home
                        {currentRoute === 'home' && (
                            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        )}
                    </button>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`text-sm font-semibold tracking-wide transition-colors text-white/60 hover:text-white`}
                    >
                        Docs
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-hover/40 border border-theme-border/50">
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-theme-accentGreen animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-500'}`} />
                        <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">{status}</span>
                    </div>

                    <button className="w-8 h-8 rounded-full bg-theme-hover/40 border border-theme-border/50 flex items-center justify-center hover:bg-theme-hover transition-colors text-slate-300">
                        <Bell size={14} />
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
