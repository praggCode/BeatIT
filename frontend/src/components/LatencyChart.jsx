import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, ComposedChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-theme-bg/90 backdrop-blur-md border border-theme-border/50 rounded p-3 shadow-xl text-xs font-mono">
            <p className="text-theme-muted mb-2 font-medium">{label}</p>
            {payload.map(p => (
                <div key={p.dataKey} className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.stroke, boxShadow: `0 0 6px ${p.stroke}` }} />
                    <span className="text-theme-text font-sans text-[10px] uppercase tracking-wider">{p.name}:</span>
                    <span className="font-bold text-white">
                        {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const LatencyChart = ({ data }) => {
    const displayData = data?.slice(-60) || [];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6CA2C8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6CA2C8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#4B5058" vertical={false} opacity={0.4} />

                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 9, fill: '#8B929B', fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={3}
                    minTickGap={50}
                />

                {/* Left Y: Latency */}
                <YAxis
                    yAxisId="latency"
                    orientation="left"
                    tick={{ fontSize: 9, fill: '#8B929B', fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={() => ''} /* Hidden ticks to match UI but maintain scale */
                    width={1}
                />

                {/* Right Y: Throughput */}
                <YAxis
                    yAxisId="throughput"
                    orientation="right"
                    tick={{ fontSize: 9, fill: '#8B929B', fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={() => ''} /* Hidden */
                    width={1}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#535860', strokeWidth: 1, strokeDasharray: '4 4' }} />

                {/* Latency */}
                <Area
                    yAxisId="latency"
                    type="monotone"
                    dataKey="p95"
                    name="Latency"
                    stroke="#6CA2C8"
                    strokeWidth={2}
                    fill="url(#latencyGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#6CA2C8', strokeWidth: 0 }}
                    isAnimationActive={false}
                    style={{ filter: 'url(#glow)' }}
                />

                {/* Throughput / RPS */}
                <Line
                    yAxisId="throughput"
                    type="monotone"
                    dataKey="throughput"
                    name="RPS"
                    stroke="#34D399"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#34D399', strokeWidth: 0 }}
                    isAnimationActive={false}
                    style={{ filter: 'url(#glow)' }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default LatencyChart;
