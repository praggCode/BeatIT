import React from 'react';
import { Cpu, Database, MemoryStick, AlertTriangle, AlertOctagon } from 'lucide-react';

const ICONS = {
    cpu: Cpu,
    database: Database,
    memory: MemoryStick,
};

const BottleneckList = ({ bottlenecks }) => {
    if (!bottlenecks || bottlenecks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <AlertTriangle size={20} className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">No bottlenecks detected</p>
                <p className="text-slate-600 text-xs mt-1">Run a test to detect performance issues</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bottlenecks.map(b => {
                const Icon = ICONS[b.icon] || AlertTriangle;
                const isCritical = b.severity === 'critical';
                return (
                    <div
                        key={b.id}
                        className={`p-4 rounded-xl border transition-all ${isCritical
                                ? 'bg-red-950/30 border-red-800/50 hover:border-red-700'
                                : 'bg-yellow-950/30 border-yellow-800/50 hover:border-yellow-700'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-lg ${isCritical ? 'bg-red-500/15' : 'bg-yellow-500/15'
                                }`}>
                                <Icon size={14} className={isCritical ? 'text-red-400' : 'text-yellow-400'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCritical
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                        {isCritical ? 'CRITICAL' : 'WARNING'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">{b.timestamp}</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-200 mb-1">{b.title}</p>
                                <p className="text-xs text-slate-400 mb-2 font-mono">{b.metric}</p>
                                <div className="flex items-start gap-1.5">
                                    <span className="text-xs text-slate-600 shrink-0">→</span>
                                    <p className="text-xs text-slate-500">{b.suggestion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BottleneckList;
