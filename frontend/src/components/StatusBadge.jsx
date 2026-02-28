import React from 'react';
import { Activity, Zap } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const configs = {
        idle: {
            dot: 'bg-slate-500',
            text: 'text-slate-400',
            bg: 'bg-slate-800/60',
            border: 'border-slate-700',
            label: 'Idle',
        },
        running: {
            dot: 'bg-cyan-400 animate-pulse',
            text: 'text-cyan-400',
            bg: 'bg-cyan-950/60',
            border: 'border-cyan-800',
            label: 'Running',
        },
        completed: {
            dot: 'bg-emerald-400',
            text: 'text-emerald-400',
            bg: 'bg-emerald-950/60',
            border: 'border-emerald-800',
            label: 'Completed',
        },
    };

    const cfg = configs[status] || configs.idle;

    return (
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${cfg.bg} ${cfg.border}`}
            aria-label={`Test status: ${cfg.label}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className={`text-sm font-medium font-mono ${cfg.text}`}>{cfg.label}</span>
            {status === 'running' && <Activity size={12} className="text-cyan-400 animate-pulse" />}
        </div>
    );
};

export default StatusBadge;
