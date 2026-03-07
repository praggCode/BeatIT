import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ThroughputChart({ metricsHistory }) {
    const data = metricsHistory.map((m, i) => ({ ...m, time: i }));
    const hasData = data.length > 0;

    const { avg, max } = useMemo(() => {
        if (!hasData) return { avg: 0, max: 0 };
        const vals = data.map(d => d.throughput || 0).filter(v => v > 0);
        if (vals.length === 0) return { avg: 0, max: 0 };
        return {
            avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
            max: Math.round(Math.max(...vals)),
        };
    }, [data, hasData]);

    const tooltipStyle = {
        backgroundColor: 'rgba(10,10,26,0.85)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
    };

    return (
        <div className="glass w-full h-full overflow-hidden">
            <div className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-1 shrink-0">
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Throughput (req/s)
                    </h2>
                    {hasData && (
                        <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            <span>Avg: <strong className="text-white">{avg}</strong></span>
                            <span>Max: <strong className="text-white">{max}</strong></span>
                        </div>
                    )}
                </div>
                <div className="w-full flex-1 min-h-[220px]">
                    {!hasData ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span className="text-lg opacity-30">📈</span>
                                </div>
                                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Waiting for test data...</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradientV2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.95} />
                                        <stop offset="100%" stopColor="#ea580c" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.08)" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} tickFormatter={(v) => `${v}s`} minTickGap={20} />
                                <YAxis stroke="rgba(255,255,255,0.08)" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} width={40} />
                                <Tooltip cursor={{ fill: 'rgba(249,115,22,0.03)' }} contentStyle={tooltipStyle}
                                    itemStyle={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)', fontSize: '12px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                                    labelFormatter={(l) => `Time: ${l}s`}
                                    formatter={(v) => [`${v} req/s`, 'Throughput']} />
                                <Bar dataKey="throughput" fill="url(#barGradientV2)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
