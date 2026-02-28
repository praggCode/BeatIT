import React from 'react';
import { Copy, Check, FileText } from 'lucide-react';

const AIReport = ({ content }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Simple markdown renderer just for this UI
    const renderMarkdown = (text) => {
        if (!text) return null;

        return text.split('\n\n').map((paragraph, idx) => {
            // Headers
            if (paragraph.startsWith('## ')) {
                return <h3 key={idx} className="text-sm font-bold text-cyan-400 mt-4 mb-2">{paragraph.replace('## ', '')}</h3>;
            }

            // Lists (simple)
            if (paragraph.includes('\n- ') || paragraph.includes('\n1. ')) {
                const lines = paragraph.split('\n');
                return (
                    <ul key={idx} className="space-y-1.5 mb-4 mt-2">
                        {lines.map((line, i) => {
                            if (line.startsWith('- ')) {
                                return (
                                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                                        <span className="text-slate-500 shrink-0">•</span>
                                        <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>') }} />
                                    </li>
                                );
                            }
                            if (line.match(/^\d+\. /)) {
                                return (
                                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                                        <span className="text-cyan-500 font-mono shrink-0">{line.match(/^\d+\./)[0]}</span>
                                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>') }} />
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                );
            }

            // Tables (very basic rendering)
            if (paragraph.includes('|--')) {
                const rows = paragraph.split('\n').filter(r => r.includes('|') && !r.includes('|--'));
                return (
                    <div key={idx} className="overflow-x-auto my-4 border border-slate-700/50 rounded-lg">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/50 text-slate-400">
                                <tr>
                                    {rows[0].split('|').filter(Boolean).map((h, i) => (
                                        <th key={i} className="px-3 py-2 font-medium border-b border-slate-700/50">{h.trim()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {rows.slice(1).map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-800/30">
                                        {row.split('|').filter(Boolean).map((cell, j) => (
                                            <td key={j} className="px-3 py-2">{cell.trim().replace(/\*\*(.*?)\*\*/g, '$1')}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }

            // Paragraphs
            return (
                <p key={idx} className="text-sm text-slate-300 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>') }}
                />
            );
        });
    };

    return (
        <div className="relative h-full flex flex-col group">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium border border-slate-600 transition-colors shadow-lg"
                >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 overflow-y-auto custom-scrollbar h-[380px]">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                        <FileText size={16} className="text-cyan-400" />
                    </div>
                    <h2 className="text-base font-bold text-slate-100">Load Test Analysis Report</h2>
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                    {renderMarkdown(content)}
                </div>
            </div>
        </div>
    );
};

export default AIReport;
