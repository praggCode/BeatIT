import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function LatencyChart({ metricsHistory, configuredSla = 500 }) {
    const data = metricsHistory.map((m, i) => ({
        ...m,
        time: i
    }));

    // Recharts requires at least some tick info, but we'll keep it clean.
    return (
        <div className="card bg-base-200 w-full overflow-hidden shrink-0 border border-base-300">
            <div className="card-body p-4">
                <h2 className="card-title text-base-content text-sm ml-2 mb-2">Latency Profile</h2>
                <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                            <XAxis
                                dataKey="time"
                                stroke="#6e7681"
                                tick={{ fill: '#6e7681', fontSize: 12 }}
                                tickFormatter={(val) => `${val}s`}
                                minTickGap={20}
                            />
                            <YAxis
                                stroke="#6e7681"
                                tick={{ fill: '#6e7681', fontSize: 12 }}
                                unit="ms"
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '6px' }}
                                itemStyle={{ fontFamily: 'JetBrains Mono' }}
                                labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
                                labelFormatter={(label) => `Time: ${label}s`}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <ReferenceLine y={configuredSla} stroke="#d29922" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${configuredSla}ms SLA`, fill: '#d29922', fontSize: 12 }} />
                            <Line type="monotone" dataKey="p50" stroke="#00d4ff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                            <Line type="monotone" dataKey="p95" stroke="#d29922" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                            <Line type="monotone" dataKey="p99" stroke="#f85149" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
