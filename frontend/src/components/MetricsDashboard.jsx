import React, { useState } from 'react';
import { Maximize2, Share2 } from 'lucide-react';
import LatencyChart from './LatencyChart';

const MetricsDashboard = ({ latestData, chartData }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mb-8 relative z-10 w-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-theme-accent rounded-full" />
                    <h2 className="text-sm font-bold tracking-widest text-[#B0B5BB] uppercase">Live Metrics</h2>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-theme-border/50 bg-theme-hover/20 hover:bg-theme-hover/50 text-[10px] uppercase font-bold tracking-widest text-theme-muted transition-all"
                >
                    {expanded ? 'Collapse' : 'Expand'} <Maximize2 size={10} />
                </button>
            </div>

            <div className={`bg-theme-card/50 backdrop-blur-xl rounded-2xl border border-theme-border/50 shadow-xl overflow-hidden relative transition-all duration-300 ${expanded ? 'h-[500px]' : 'h-[320px]'} flex flex-col`}>
                <div className="flex justify-between items-center px-6 pt-6 z-10">
                    <h3 className="text-xs font-bold tracking-wide text-theme-muted">Latency vs Throughput</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_rgba(108,162,200,0.8)]"></span>
                            <span className="text-[9px] font-bold text-theme-muted tracking-widest uppercase">Latency</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-theme-accentGreen shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            <span className="text-[9px] font-bold text-theme-muted tracking-widest uppercase">RPS</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full relative z-0 mt-4 px-4 pb-4">
                    <LatencyChart data={chartData} />
                </div>

                {/* Inner ambient glow */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
    );
};

export default MetricsDashboard;
