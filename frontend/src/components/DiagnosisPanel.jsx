import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function DiagnosisPanel({ status, diagnosis }) {
    // Show nothing when idle
    if (status === 'idle') return null;

    // Show loading spinner while running or when completed but waiting for AI response
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

    // Parse Gemini response
    // Expected to find keywords: ROOT CAUSE, SEVERITY, FIX, RISK
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

        // Fallback if no matching sections are provided
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
                <h2 className="font-mono text-xl text-base-content tracking-tight">AI Diagnosis</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    <div className="col-span-1 md:col-span-3">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-1 font-bold">Root Cause</h3>
                        <p className="text-white text-sm leading-relaxed">{parsed.rootCause}</p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-1 font-bold">Severity</h3>
                        <div className={`badge ${getSeverityBadge(parsed.severity)} font-bold p-3`}>
                            {parsed.severity.toUpperCase()}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 border-t border-base-300 pt-4">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-2 font-bold">Fix</h3>
                        <ol className="list-decimal list-outside ml-4 text-sm text-base-content/70 space-y-1">
                            {parsed.fix.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="col-span-1 border-t border-base-300 pt-4">
                        <h3 className="text-xs uppercase tracking-widest text-base-content/50 mb-1 font-bold">Risk</h3>
                        <p className="text-warning text-sm font-medium leading-relaxed">{parsed.risk}</p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
