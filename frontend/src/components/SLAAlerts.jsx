import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

const SLAAlerts = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-950/30 flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                </div>
                <p className="text-emerald-400 font-medium text-sm">No SLA violations</p>
                <p className="text-slate-500 text-xs mt-1">All metrics are within threshold limits</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {alerts.map(alert => {
                const isCritical = alert.severity === 'critical';
                const Icon = isCritical ? AlertCircle : AlertTriangle;
                const colorClass = isCritical ? 'text-red-400' : 'text-yellow-400';
                const bgClass = isCritical ? 'bg-red-950/40 border-red-800' : 'bg-yellow-950/40 border-yellow-800';

                return (
                    <div key={alert.id} className={`p-4 rounded-xl border ${bgClass} transition-all`}>
                        <div className="flex items-start gap-3">
                            <Icon size={18} className={`${colorClass} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`text-sm font-bold ${colorClass}`}>{alert.title}</h4>
                                    <span className="text-xs text-slate-500 font-mono ml-auto">{alert.timestamp}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-slate-900/50 rounded flex flex-col p-2 border border-slate-800/50">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Threshold</span>
                                        <span className="text-xs font-mono text-slate-300">{alert.threshold}</span>
                                    </div>
                                    <div className="bg-slate-900/50 rounded flex flex-col p-2 border border-slate-800/50">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Actual</span>
                                        <span className={`text-xs font-bold font-mono ${colorClass}`}>{alert.actual}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 mt-2 flex justify-between">
                                    <span>Duration: <span className="font-mono text-slate-300">{alert.duration}</span></span>
                                    <span className="uppercase text-[10px] tracking-widest font-bold">violating</span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SLAAlerts;
