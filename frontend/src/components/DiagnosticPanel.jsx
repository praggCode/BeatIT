import React, { useState } from 'react';
import { Activity, BellRing, Sparkles, Scale } from 'lucide-react';
import BottleneckList from './BottleneckList';
import SLAAlerts from './SLAAlerts';
import AIReport from './AIReport';
import RunComparison from './RunComparison';
import { INITIAL_BOTTLENECKS, INITIAL_SLA_ALERTS, COMPARISON_DATA, AI_REPORT_CONTENT } from '../utils/mockData';

const DiagnosticPanel = ({ isRunning }) => {
    const [activeTab, setActiveTab] = useState('bottlenecks');

    const tabs = [
        { id: 'bottlenecks', label: 'Bottlenecks', icon: Activity },
        { id: 'sla', label: 'SLA Alerts', icon: BellRing },
        { id: 'ai', label: 'AI Report', icon: Sparkles },
        { id: 'compare', label: 'Compare', icon: Scale },
    ];

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col">
            {/* Header & Tabs */}
            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="px-5 py-4 flex flex-wrap gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                                    ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-900/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                }`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-cyan-400' : ''} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 overflow-y-auto">
                {activeTab === 'bottlenecks' && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-red-400" /> Detected Performance Issues
                        </h3>
                        <BottleneckList bottlenecks={isRunning ? [] : INITIAL_BOTTLENECKS} />
                    </div>
                )}

                {activeTab === 'sla' && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <BellRing size={16} className="text-amber-400" /> Active SLA Violations
                        </h3>
                        <SLAAlerts alerts={isRunning ? [] : INITIAL_SLA_ALERTS} />
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                        {isRunning ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
                                <Sparkles size={24} className="text-cyan-500/50 animate-pulse mb-3" />
                                <p className="text-sm">Analyzing test runs...</p>
                                <p className="text-xs text-slate-500 mt-1">Report will be generated when test completes</p>
                            </div>
                        ) : (
                            <AIReport content={AI_REPORT_CONTENT} />
                        )}
                    </div>
                )}

                {activeTab === 'compare' && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Scale size={16} className="text-blue-400" /> Previous Run Comparison
                        </h3>
                        <RunComparison data={isRunning ? [] : COMPARISON_DATA} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticPanel;
