import React from 'react';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

const RunComparison = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <Layers size={20} className="text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium text-sm">No comparison available</p>
                <p className="text-slate-500 text-xs mt-1">Run multiple tests to compare results</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                    <tr>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">Metric</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">Before</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">After</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs text-right">Change</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 bg-slate-950/30">
                    {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-300">{row.metric}</td>
                            <td className="px-4 py-3 font-mono text-slate-400">{row.before}</td>
                            <td className="px-4 py-3 font-mono text-slate-200">{row.after}</td>
                            <td className="px-4 py-3 text-right flex justify-end">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-bold w-fit
                  ${row.improved
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}
                                >
                                    {row.change > 0 ? (
                                        <ArrowUpRight size={14} className={row.improved ? 'text-emerald-400' : 'text-red-400'} />
                                    ) : (
                                        <ArrowDownRight size={14} className={row.improved ? 'text-emerald-400' : 'text-red-400'} />
                                    )}
                                    {Math.abs(row.change).toFixed(1)}%
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RunComparison;
