import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function StatCards({ latestMetrics, metricsHistory, configuredSla }) {
    const prevMetrics = metricsHistory && metricsHistory.length > 1
        ? metricsHistory[metricsHistory.length - 2]
        : null;

    const getDeltaInfo = (metric) => {
        if (!latestMetrics || !prevMetrics) return null;
        const curr = latestMetrics[metric];
        const prev = prevMetrics[metric];
        if (curr === undefined || prev === undefined) return null;

        if (curr > prev) return { direction: 'worse', icon: <TrendingUp className="w-4 h-4 text-error" /> };
        if (curr < prev) return { direction: 'better', icon: <TrendingDown className="w-4 h-4 text-success" /> };
        return { direction: 'same', icon: <Minus className="w-4 h-4 text-base-content/50" /> };
    };

    const formatValue = (val) => {
        if (val === undefined || val === null) return '—';
        return val;
    };

    const getP95Color = (val) => {
        if (!val || !configuredSla) return 'text-base-content';
        if (val > configuredSla * 0.9) return 'text-error'; // p95 is getting dangerously close to p99 SLA
        if (val > configuredSla * 0.7) return 'text-warning'; // warning zone
        return 'text-base-content';
    };

    const getP99Color = (val) => {
        if (!val || !configuredSla) return 'text-base-content';
        if (val >= configuredSla) return 'text-error'; // exact breach
        if (val > configuredSla * 0.8) return 'text-warning';
        return 'text-base-content';
    };

    const p50Val = latestMetrics?.p50;
    const p95Val = latestMetrics?.p95;
    const p99Val = latestMetrics?.p99;

    const p50Delta = getDeltaInfo('p50');
    const p95Delta = getDeltaInfo('p95');
    const p99Delta = getDeltaInfo('p99');

    return (
        <div className="stats shadow bg-base-200 w-full mb-2">
            <div className="stat place-items-start">
                <div className="stat-title text-base-content/70">Median</div>
                <div className="stat-value font-mono text-4xl flex items-center gap-2 text-base-content">
                    {formatValue(p50Val)}
                    {p50Delta && p50Delta.icon}
                </div>
                <div className="stat-desc mt-1 text-base-content/50">ms · 50th percentile</div>
            </div>

            <div className="stat place-items-start border-l border-base-300">
                <div className="stat-title text-base-content/70">p95</div>
                <div className={`stat-value font-mono text-4xl flex items-center gap-2 ${getP95Color(p95Val)}`}>
                    {formatValue(p95Val)}
                    {p95Delta && p95Delta.icon}
                </div>
                <div className="stat-desc mt-1 text-base-content/50">ms · 95th percentile</div>
            </div>

            <div className="stat place-items-start border-l border-base-300">
                <div className="stat-title text-base-content/70">p99</div>
                <div className={`stat-value font-mono text-4xl flex items-center gap-2 ${getP99Color(p99Val)}`}>
                    {formatValue(p99Val)}
                    {p99Delta && p99Delta.icon}
                </div>
                <div className="stat-desc mt-1 text-base-content/50">ms · 99th percentile</div>
            </div>
        </div>
    );
}
