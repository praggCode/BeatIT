import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Cloud, AlertCircle } from 'lucide-react';

const TopSummary = ({ data, chartData }) => {
    const current = data || { throughput: 0, errorRate: 0, p95: 0 };
    const sparklineData = chartData?.slice(-20) || [];

    return (
        <div className="w-full flex flex-col gap-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Throughput Card */}
                <div className="bg-theme-card/60 backdrop-blur-md rounded-2xl p-6 border border-theme-border/50 shadow-lg relative overflow-hidden group hover:border-theme-accent/30 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Throughput</span>
                        <Cloud className="text-theme-accent/60" size={14} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white font-mono tracking-tighter shadow-sm">
                            {current.throughput}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-theme-muted">req/s</span>
                    </div>
                    {/* Subtle gradient glow */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-theme-accent/5 rounded-full blur-3xl group-hover:bg-theme-accent/10 transition-colors" />
                </div>

                {/* Error Rate Card */}
                <div className="bg-theme-card/60 backdrop-blur-md rounded-2xl p-6 border border-theme-border/50 shadow-lg relative overflow-hidden group hover:border-red-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Error Rate</span>
                        <AlertCircle className="text-red-500/60" size={14} />
                    </div>
                    <div className="flex items-baseline gap-1 z-10">
                        <span className="text-3xl font-bold text-white font-mono tracking-tighter">
                            {current.errorRate.toFixed(1)}
                        </span>
                        <span className="text-sm font-bold text-theme-muted">%</span>
                    </div>
                    {current.errorRate > 0 && (
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                    )}
                </div>
            </div>

            {/* Latency P95 Long Card */}
            <div className="bg-theme-card/60 backdrop-blur-md rounded-2xl p-6 border border-theme-border/50 shadow-lg flex items-center justify-between relative overflow-hidden group hover:border-theme-border transition-colors">
                <div className="flex flex-col justify-between h-full z-10">
                    <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-6">Latency (P95)</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white font-mono tracking-tighter">
                            {current.p95 || '--'}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-theme-muted">ms</span>
                    </div>
                </div>

                {/* Sparkline Column Chart */}
                <div className="w-1/4 h-16 ml-4 opacity-40 z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="step"
                                dataKey="p95"
                                stroke="#6CA2C8"
                                strokeWidth={4}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-theme-bg/10 pointer-events-none" />
            </div>
        </div>
    );
};

export default TopSummary;
