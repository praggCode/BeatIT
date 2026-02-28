import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricsCard = ({ label, value, unit, trend, trendPct, sparkData, sparkKey, color = '#06b6d4', icon: Icon }) => {
    const isPositiveTrend = trend === 'up';
    const trendGood = (label.includes('Throughput') || label.includes('Users')) ? isPositiveTrend : !isPositiveTrend;

    const displayValue = useMemo(() => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'number') {
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            if (Number.isInteger(value)) return value.toString();
            return value.toFixed(1);
        }
        return value;
    }, [value]);

    return (
        <div className="group relative bg-slate-900/80 rounded-xl border border-slate-800
      hover:border-cyan-500/30 transition-all duration-300 overflow-hidden p-5
      hover:shadow-lg hover:shadow-cyan-500/5">
            {/* Gradient top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
                {Icon && <Icon size={14} className="text-slate-600 group-hover:text-cyan-500/60 transition-colors" />}
            </div>

            {/* Value */}
            <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold font-mono text-slate-100 leading-none"
                    style={{ color: value !== null ? undefined : '#475569' }}>
                    {displayValue}
                </span>
                {unit && <span className="text-sm text-slate-500 mb-0.5 font-mono">{unit}</span>}
            </div>

            {/* Trend + Sparkline */}
            <div className="flex items-center justify-between">
                {trendPct !== undefined && trendPct !== null ? (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
            ${trendGood
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {isPositiveTrend ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{Math.abs(trendPct).toFixed(1)}%</span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-600">—</span>
                )}

                {/* Sparkline */}
                {sparkData && sparkData.length > 2 && (
                    <div className="w-20 h-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                                <Line
                                    type="monotone"
                                    dataKey={sparkKey}
                                    stroke={color}
                                    strokeWidth={1.5}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricsCard;
