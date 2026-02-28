import React from 'react';
import { LayoutDashboard, History, Settings2, Settings } from 'lucide-react';

const BottomNav = () => {
    return (
        <div className="fixed bottom-6 inset-x-0 w-full flex justify-center z-50 pointer-events-none">
            <div className="bg-theme-card/60 backdrop-blur-xl border border-theme-border/50 rounded-full px-2 py-2 flex items-center justify-center gap-14 shadow-2xl pointer-events-auto">

                <button className="relative group p-3">
                    <div className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                    <LayoutDashboard size={20} className="text-white relative z-10" />
                </button>

                <button className="p-3 text-theme-muted hover:text-white transition-colors">
                    <History size={20} />
                </button>

                <button className="p-3 text-theme-muted hover:text-white transition-colors">
                    <Settings2 size={20} />
                </button>

                <button className="p-3 text-theme-muted hover:text-white transition-colors">
                    <Settings size={20} />
                </button>

            </div>
        </div>
    );
};

export default BottomNav;
