import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ErrorRateChart({ metricsHistory, maxErrorRate = 5 }) {
    const data = metricsHistory.map((m, i) => ({ ...m, errorRate: parseFloat(m.errorRate || 0), time: i }));
    const hasData = data.length > 0;

    const tooltipStyle = {
        backgroundColor: 'var(--glass-bg-4)',
        borderColor: 'var(--glass-border-3)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
    };

    return (
        <div className="glass w-full h-full overflow-hidden">
            <div className="p-5 flex flex-col h-full">
                <h2 className="text-base font-semibold shrink-0 mb-1" style={{ color: 'var(--text-primary)' }}>
                    Error Rate (%)
                </h2>
                <div className="w-full flex-1 min-h-[220px]">
                    {!hasData ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse"
                                    style={{ background: 'var(--glass-bg-3)', border: '1px solid var(--glass-border-1)' }}>
                                    <span className="text-lg opacity-30">⚠️</span>
                                </div>
                                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Waiting for test data...</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border-1)" vertical={false} />
                                <XAxis dataKey="time" stroke="var(--glass-border-2)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={(v) => `${v}s`} minTickGap={20} />
                                <YAxis stroke="var(--glass-border-2)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={35} domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
                                <Tooltip contentStyle={tooltipStyle}
                                    itemStyle={{ fontFamily: 'JetBrains Mono', color: 'var(--error)', fontSize: '12px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                                    labelFormatter={(l) => `Time: ${l}s`}
                                    formatter={(v) => [`${v}%`, 'Errors']} />
                                <ReferenceLine y={maxErrorRate} stroke="var(--error)" strokeDasharray="6 4" strokeOpacity={0.5}
                                    label={{ position: 'right', value: `${maxErrorRate}% Limit`, fill: 'var(--error)', fontSize: 10, opacity: 0.7 }} />
                                <Line type="monotone" dataKey="errorRate" stroke="var(--error)" strokeWidth={2} dot={false}
                                    activeDot={{ r: 4, fill: 'var(--error)' }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
