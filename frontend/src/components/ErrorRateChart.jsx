import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function ErrorRateChart({ metricsHistory }) {
    const data = metricsHistory.map((m, i) => ({
        ...m,
        errorRate: parseFloat(m.errorRate || 0),
        time: i
    }));

    return (
        <div className="card bg-base-200 w-full h-full overflow-hidden border border-base-300">
            <div className="card-body p-4 flex flex-col h-full">
                <h2 className="card-title text-base-content text-sm ml-2 mb-2 shrink-0">Error Rate</h2>
                <div className="w-full flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                width={40}
                                domain={[0, 'dataMax > 5 ? dataMax : 5']}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '6px' }}
                                itemStyle={{ fontFamily: 'JetBrains Mono', color: '#f85149' }}
                                labelStyle={{ color: '#8b949e', marginBottom: '4px' }}
                                labelFormatter={(label) => `Time: ${label}s`}
                                formatter={(value) => [`${value}%`, 'Errors']}
                            />
                            <Area
                                type="monotone"
                                dataKey="errorRate"
                                stroke="#f85149"
                                fill="#f85149"
                                fillOpacity={0.2}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
