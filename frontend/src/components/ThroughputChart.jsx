import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function ThroughputChart({ metricsHistory }) {
    const data = metricsHistory.map((m, i) => ({
        ...m,
        time: i
    }));

    return (
        <div className="card bg-base-200 w-full h-full overflow-hidden border border-base-300">
            <div className="card-body p-4 flex flex-col h-full">
                <h2 className="card-title text-base-content text-sm ml-2 mb-2 shrink-0">Throughput</h2>
                <div className="w-full flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                width={50}
                            />
                            <Tooltip
                                cursor={{ fill: '#21262d' }}
                                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '6px' }}
                                itemStyle={{ fontFamily: 'JetBrains Mono', color: '#00d4ff' }}
                                labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
                                labelFormatter={(label) => `Time: ${label}s`}
                                formatter={(value) => [`${value} req/s`, 'Throughput']}
                            />
                            <Bar dataKey="throughput" fill="#00d4ff" isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
