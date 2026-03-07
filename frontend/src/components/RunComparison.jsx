import React from 'react';
import { ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

const RunComparison = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Layers size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="font-medium text-sm" style={{ color: 'var(--text-muted)' }}>No comparison available</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>Run multiple tests to compare results</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <th className="px-4 py-3 font-medium uppercase tracking-[0.15em] text-[10px]" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Metric</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-[0.15em] text-[10px]" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Before</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-[0.15em] text-[10px]" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>After</th>
                        <th className="px-4 py-3 font-medium uppercase tracking-[0.15em] text-[10px] text-right" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Change</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}
                            className="transition-colors duration-200"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <td className="px-4 py-3 font-medium text-[13px]" style={{ color: 'var(--text-secondary)' }}>{row.metric}</td>
                            <td className="px-4 py-3 font-mono text-[13px]" style={{ color: 'var(--text-muted)' }}>{row.before}</td>
                            <td className="px-4 py-3 font-mono text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.after}</td>
                            <td className="px-4 py-3 text-right flex justify-end">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold w-fit"
                                    style={{
                                        backgroundColor: row.improved ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                                        color: row.improved ? 'var(--success)' : 'var(--error)',
                                        border: row.improved ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(248,113,113,0.15)',
                                        boxShadow: row.improved ? '0 0 10px rgba(52,211,153,0.06)' : '0 0 10px rgba(248,113,113,0.06)',
                                        backdropFilter: 'blur(8px)',
                                    }}>
                                    {row.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
