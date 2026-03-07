import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeftRight } from 'lucide-react';
import { useDownloadReport } from '../hooks/useDownloadReport';

export default function DiagnosisPanel({ status, diagnosis, latestMetrics, target, hasDiff, onToggleComparison, showComparison }) {
    const { download } = useDownloadReport();
    if (status === 'idle') return null;
    if (status === 'running' || (status === 'completed' && !diagnosis)) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass glow-left-accent w-full"
                style={{ borderLeft: '3px solid var(--accent)' }}
            >
                <div className="p-6 text-center">
                    <h2 className="text-lg mb-4 font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        AI Diagnosis
                    </h2>
                    <div className="flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                        <span className="loading loading-dots loading-md" style={{ color: 'var(--accent)' }}></span>
                        <span className="text-sm font-medium">
                            {status === 'running' ? 'Collecting metrics...' : 'Analysing results...'}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    const parsed = useMemo(() => {
        const result = { rootCause: 'Unable to parse root cause', severity: 'Unknown', fix: [], risk: 'Unknown risk factors' };
        const regex = /(ROOT CAUSE|SEVERITY|FIX|RISK)[:\s-]*([\s\S]*?)(?=(ROOT CAUSE|SEVERITY|FIX|RISK)[:\s-]*|$)/ig;
        let match, foundAny = false;
        while ((match = regex.exec(diagnosis)) !== null) {
            foundAny = true;
            const key = match[1].toUpperCase(), content = match[2].trim();
            if (key === 'ROOT CAUSE') result.rootCause = content;
            if (key === 'SEVERITY') result.severity = content;
            if (key === 'FIX') result.fix = content.split(/\n+/).map(l => l.replace(/^[\d\-\*\.]+\s*/, '').trim()).filter(Boolean);
            if (key === 'RISK') result.risk = content;
        }
        if (!foundAny && typeof diagnosis === 'string' && diagnosis.length > 0) {
            result.rootCause = diagnosis; result.severity = 'N/A'; result.risk = 'N/A';
        }
        return result;
    }, [diagnosis]);

    const getSeverityStyle = (sev) => {
        const s = sev.toLowerCase();
        if (s.includes('high') || s.includes('critical'))
            return { bg: 'rgba(248,113,113,0.1)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.2)', glow: '0 0 15px rgba(248,113,113,0.1)' };
        if (s.includes('low') || s.includes('minor'))
            return { bg: 'rgba(52,211,153,0.1)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.2)', glow: '0 0 15px rgba(52,211,153,0.1)' };
        return { bg: 'rgba(251,191,36,0.1)', color: 'var(--warning)', border: '1px solid rgba(251,191,36,0.2)', glow: '0 0 15px rgba(251,191,36,0.1)' };
    };

    const sevStyle = getSeverityStyle(parsed.severity);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass glow-left-accent w-full"
            style={{ borderLeft: '3px solid var(--accent)' }}
        >
            <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        AI Diagnosis
                    </h2>
                    <div className="flex items-center gap-2">
                        {hasDiff && (
                            <button onClick={onToggleComparison}
                                className="text-[12px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200"
                                style={{
                                    background: showComparison ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.08)',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                    color: showComparison ? '#fff' : '#a5b4fc',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                }}>
                                {showComparison ? 'Hide Comparison' : (<span className="flex items-center gap-1"><ArrowLeftRight className="w-3 h-3" /> Compare</span>)}
                            </button>
                        )}
                        <button onClick={() => download({ parsed, metrics: latestMetrics, target })}
                            className="text-[12px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200"
                            style={{
                                background: 'linear-gradient(135deg, #34d399, #059669)',
                                border: 'none', color: '#fff', cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(52,211,153,0.2)',
                            }}>
                            <span className="flex items-center gap-1"><Download className="w-3 h-3" /> PDF</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-[10px] uppercase tracking-[0.15em] mb-1.5 font-bold" style={{ color: 'var(--text-muted)' }}>Root Cause</h3>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{parsed.rootCause}</p>
                    </div>
                    <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
                    <div>
                        <h3 className="text-[10px] uppercase tracking-[0.15em] mb-2 font-bold" style={{ color: 'var(--text-muted)' }}>Recommended Fix</h3>
                        <ol className="list-decimal list-outside ml-4 text-[13px] space-y-1" style={{ color: 'var(--text-secondary)' }}>
                            {parsed.fix.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                    </div>
                    <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.15em] mb-2 font-bold" style={{ color: 'var(--text-muted)' }}>Severity</h3>
                            <span className="font-bold px-3.5 py-1.5 rounded-xl text-[12px] inline-block"
                                style={{ backgroundColor: sevStyle.bg, color: sevStyle.color, border: sevStyle.border, boxShadow: sevStyle.glow, backdropFilter: 'blur(8px)' }}>
                                {parsed.severity.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.15em] mb-1.5 font-bold" style={{ color: 'var(--text-muted)' }}>Risk</h3>
                            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{parsed.risk}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
