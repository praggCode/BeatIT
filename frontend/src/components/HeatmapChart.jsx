import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BUCKETS = [
    { label: '0–50ms', index: 0, color: '#10b981' },
    { label: '50–100ms', index: 1, color: '#84cc16' },
    { label: '100–200ms', index: 2, color: '#f59e0b' },
    { label: '200–500ms', index: 3, color: '#f97316' },
    { label: '500ms+', index: 4, color: '#ef4444' },
];

const getBucketColor = (bucketIdx) => BUCKETS[bucketIdx]?.color ?? '#64748b';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono shadow-xl">
            <p className="text-slate-400 mb-1">Latency Bucket</p>
            <p className="font-bold" style={{ color: getBucketColor(d.bucket) }}>
                {BUCKETS[d.bucket]?.label}
            </p>
            <p className="text-slate-400 mt-1">~{d.value}ms avg</p>
        </div>
    );
};

const HeatmapChart = ({ data }) => {
    const displayData = data.slice(-60);

    return (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-200">Latency Distribution</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Response time bucket heatmap</p>
                </div>
                <div className="flex items-center gap-3">
                    {BUCKETS.map(b => (
                        <div key={b.index} className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                            <span className="text-xs text-slate-500 hidden lg:inline">{b.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <XAxis
                        dataKey="time"
                        name="Time"
                        tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        dataKey="bucket"
                        name="Latency"
                        type="number"
                        domain={[0, 4]}
                        ticks={[0, 1, 2, 3, 4]}
                        tickFormatter={i => BUCKETS[i]?.label ?? ''}
                        tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                        width={70}
                    />
                    <ZAxis dataKey="count" range={[20, 80]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={displayData} isAnimationActive={false}>
                        {displayData.map((entry, idx) => (
                            <Cell
                                key={idx}
                                fill={getBucketColor(entry.bucket)}
                                fillOpacity={0.7}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HeatmapChart;
