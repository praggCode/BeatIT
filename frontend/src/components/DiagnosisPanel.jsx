import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
                className="card bg-base-200 border-l-4 border-primary w-full"
            >
                <div className="card-body p-6 text-center">
                    <h2 className="font-mono text-xl text-base-content mb-4 tracking-tight">AI Diagnosis</h2>
                    <div className="flex flex-col items-center gap-3 text-base-content/60">
                        <span className="loading loading-dots loading-md text-primary"></span>
                        <span className="text-sm font-medium">
                            {status === 'running' ? 'Collecting metrics...' : 'Analysing results...'}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }
    const parsed = useMemo(() => {
        const result = {
            rootCause: 'Unable to parse root cause',
            severity: 'Unknown',
            fix: [],
            risk: 'Unknown risk factors'
        };

        const regex = /(ROOT CAUSE|SEVERITY|FIX|RISK)[:\s-]*([\s\S]*?)(?=(ROOT CAUSE|SEVERITY|FIX|RISK)[:\s-]*|$)/ig;

        let match;
        let foundAny = false;
        while ((match = regex.exec(diagnosis)) !== null) {
            foundAny = true;
            const key = match[1].toUpperCase();
            const content = match[2].trim();

            if (key === 'ROOT CAUSE') result.rootCause = content;
            if (key === 'SEVERITY') result.severity = content;
            if (key === 'FIX') {
                result.fix = content.split(/\n+/).map(line => line.replace(/^[\d\-\*\.]+\s*/, '').trim()).filter(Boolean);
            }
            if (key === 'RISK') result.risk = content;
        }

        if (!foundAny && typeof diagnosis === 'string' && diagnosis.length > 0) {
            result.rootCause = diagnosis;
            result.severity = 'N/A';
            result.risk = 'N/A';
        }

        return result;
    }, [diagnosis]);

    const getSeverityBadge = (sev) => {
        const s = sev.toLowerCase();
        if (s.includes('high') || s.includes('critical')) return 'badge-error';
        if (s.includes('low') || s.includes('minor')) return 'badge-success';
        return 'badge-warning';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card bg-base-200 border-l-4 border-primary w-full shadow-lg"
        >
            <div className="card-body p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="font-mono text-xl text-base-content tracking-tight">AI Diagnosis</h2>
                    <div className="flex items-center gap-2">
                        {hasDiff && (
                            <button
                                onClick={onToggleComparison}
                                style={{
                                    background: showComparison
                                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                        : 'rgba(99,102,241,0.15)',
                                    border: '1px solid rgba(99,102,241,0.4)',
                                    color: showComparison ? '#fff' : '#a5b4fc',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    letterSpacing: '0.04em',
                                    padding: '6px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                {showComparison ? 'Hide Comparison' : 'Compare with Previous'}
                            </button>
                        )}
                        <button
                            onClick={() => download({ parsed, metrics: latestMetrics, target })}
                            style={{
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                letterSpacing: '0.04em',
                                padding: '6px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                boxShadow: '0 0 12px rgba(34,197,94,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            ⬇ Download PDF
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-5">

                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-1 font-bold">Root Cause</h3>
                        <p className="text-base-content text-sm leading-relaxed">{parsed.rootCause}</p>
                    </div>
                    <div className="border-t border-base-300 pt-4">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-2 font-bold">Fix</h3>
                        <ol className="list-decimal list-outside ml-4 text-sm text-base-content/70 space-y-1">
                            {parsed.fix.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="grid grid-cols-2 gap-6 border-t border-base-300 pt-4">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-2 font-bold">Severity</h3>
                            <div className={`badge ${getSeverityBadge(parsed.severity)} font-bold p-3`}>
                                {parsed.severity.toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-1 font-bold">Risk</h3>
                            <p className="text-base-content/80 text-sm leading-relaxed">{parsed.risk}</p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
