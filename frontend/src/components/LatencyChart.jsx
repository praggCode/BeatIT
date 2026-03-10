import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';

export default function LatencyChart({ metricsHistory, configuredSla = 500 }) {
    const [timeRange, setTimeRange] = useState('30s');
    const data = metricsHistory.map((m, i) => ({ ...m, time: i }));
    const hasData = data.length > 0;

    const ranges = ['30s', '60s', '5m'];

    const tooltipStyle = {
        backgroundColor: 'var(--glass-bg-4)',
        borderColor: 'var(--glass-border-3)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
    };

    return (
        <div className="glass w-full overflow-hidden">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Response Latency (ms)
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#60a5fa' }}></span>
                                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>p50 Latency</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
                                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>p99 Latency</span>
                            </div>
                        </div>
                    </div>

                    {/* Time range selector */}
                    <div className="flex rounded-lg overflow-hidden"
                        style={{ border: '1px solid var(--glass-border-2)' }}>
                        {ranges.map(r => (
                            <button key={r}
                                className="px-3 py-1.5 text-[11px] font-semibold transition-all duration-150"
                                style={{
                                    background: timeRange === r ? 'var(--glass-border-3)' : 'transparent',
                                    color: timeRange === r ? 'var(--text-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    border: 'none',
                                    borderRight: r !== '5m' ? '1px solid var(--glass-border-1)' : 'none',
                                }}
                                onClick={() => setTimeRange(r)}
                            >{r}</button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-[260px]">
                    {!hasData ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse"
                                    style={{ background: 'var(--glass-bg-3)', border: '1px solid var(--glass-border-1)' }}>
                                    <span className="text-lg opacity-30">📊</span>
                                </div>
                                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Waiting for test data...</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="p99Fill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-1)" vertical={false} />
                                <XAxis dataKey="time" stroke="var(--glass-border-2)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    tickFormatter={(v) => {
                                        const total = data.length;
                                        return `-${total - v}s`;
                                    }} minTickGap={30} />
                                <YAxis stroke="var(--glass-border-2)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} unit="ms" width={55} />
                                <Tooltip contentStyle={tooltipStyle}
                                    itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                                    labelFormatter={(l) => `Time: -${data.length - l}s`} />
                                <ReferenceLine y={configuredSla} stroke="var(--accent)" strokeDasharray="6 4" strokeOpacity={0.5}
                                    label={{ position: 'right', value: `SLA (${configuredSla}ms)`, fill: 'var(--accent)', fontSize: 11, opacity: 0.7 }} />
                                <Area type="monotone" dataKey="p99" stroke="var(--accent)" strokeWidth={2.5}
                                    fill="url(#p99Fill)" fillOpacity={1} dot={false}
                                    activeDot={{ r: 4, fill: 'var(--accent)' }} isAnimationActive={false} name="p99" />
                                <Line type="monotone" dataKey="p50" stroke="#60a5fa" strokeWidth={2}
                                    dot={false} activeDot={{ r: 4 }} isAnimationActive={false} name="p50" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
