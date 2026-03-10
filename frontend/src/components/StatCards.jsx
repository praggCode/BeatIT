import React from 'react';
import { TrendingDown, TrendingUp, Activity, Gauge, Timer, Zap } from 'lucide-react';

export default function StatCards({ latestMetrics, metricsHistory }) {
    const prevMetrics = metricsHistory && metricsHistory.length > 1
        ? metricsHistory[metricsHistory.length - 2]
        : null;

    const getDelta = (curr, prev) => {
        if (curr === undefined || prev === undefined || prev === 0) return null;
        const pct = ((curr - prev) / prev) * 100;
        return pct;
    };

    const fmt = (val) => (val === undefined || val === null) ? '—' : val;

    const avgLatency = latestMetrics?.p50;
    const p99Latency = latestMetrics?.p99;
    const throughput = latestMetrics?.throughput;
    const errorRate = latestMetrics?.errorRate;

    const prevAvg = prevMetrics?.p50;
    const prevP99 = prevMetrics?.p99;
    const prevThroughput = prevMetrics?.throughput;
    const prevErrorRate = prevMetrics?.errorRate;

    const cards = [
        {
            label: 'Avg Latency',
            value: avgLatency, unit: 'ms',
            delta: getDelta(avgLatency, prevAvg),
            invertDelta: true, // lower is better
            icon: Activity,
            gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.03))',
        },
        {
            label: 'p99 Latency',
            value: p99Latency, unit: 'ms',
            delta: getDelta(p99Latency, prevP99),
            invertDelta: true,
            icon: Timer,
            gradient: 'linear-gradient(135deg, rgba(248,113,113,0.12), rgba(248,113,113,0.03))',
        },
        {
            label: 'Throughput',
            value: throughput, unit: 'req/s',
            delta: getDelta(throughput, prevThroughput),
            invertDelta: false, // higher is better
            icon: Gauge,
            gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.03))',
        },
        {
            label: 'Error Rate',
            value: errorRate !== undefined ? `${parseFloat(errorRate).toFixed(1)}` : undefined,
            unit: '%',
            delta: getDelta(parseFloat(errorRate), parseFloat(prevErrorRate)),
            invertDelta: true,
            icon: Zap,
            gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.03))',
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 w-full">
            {cards.map((card) => {
                const Icon = card.icon;
                const hasDelta = card.delta !== null && card.delta !== undefined && !isNaN(card.delta);
                let isGood = false;
                let isNeutral = false;
                if (hasDelta) {
                    if (Math.abs(card.delta) < 0.05) {
                        isNeutral = true;
                    } else {
                        isGood = card.invertDelta ? card.delta < 0 : card.delta > 0;
                    }
                }
                const deltaAbs = hasDelta ? Math.abs(card.delta).toFixed(1) : null;

                return (
                    <div key={card.label} className="glass hover-lift p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 opacity-40 pointer-events-none"
                            style={{ background: card.gradient, borderRadius: '0 16px 0 100%' }} />

                        <div className="flex items-center justify-between mb-3 relative z-1">
                            <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                {card.label}
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        <div className="flex items-end gap-3 relative z-1">
                            <div>
                                <span className="font-bold text-3xl leading-none tracking-tight"
                                    style={{ color: 'var(--text-primary)' }}>
                                    {fmt(card.value)}
                                </span>
                                <span className="text-[13px] font-medium ml-1" style={{ color: 'var(--text-muted)' }}>
                                    {card.unit}
                                </span>
                            </div>

                            {hasDelta && (
                                <div className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-md"
                                    style={{
                                        background: isNeutral ? 'rgba(255,255,255,0.05)' : (isGood ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'),
                                    }}>
                                    {isNeutral ? (
                                        <Activity className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                                    ) : isGood ? (
                                        <TrendingDown className="w-3 h-3" style={{ color: 'var(--success)' }} />
                                    ) : (
                                        <TrendingUp className="w-3 h-3" style={{ color: 'var(--error)' }} />
                                    )}
                                    <span className="text-[11px] font-bold"
                                        style={{ color: isNeutral ? 'var(--text-muted)' : (isGood ? 'var(--success)' : 'var(--error)') }}>
                                        {isNeutral ? '' : (card.delta > 0 ? '+' : '-')}{deltaAbs}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
