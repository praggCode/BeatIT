import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import NavigationSidebar from './components/NavigationSidebar';
import TopBar from './components/TopBar';
import StatCards from './components/StatCards';
import LatencyChart from './components/LatencyChart';
import ThroughputChart from './components/ThroughputChart';
import ErrorRateChart from './components/ErrorRateChart';
import AlertFeed from './components/AlertFeed';
import DiagnosisPanel from './components/DiagnosisPanel';
import RunComparison from './components/RunComparison';
import TestConfigPage from './components/TestConfigPage';

export default function App() {
    const ws = useWebSocket();
    const [activePage, setActivePage] = useState('analytics');
    const [testDurationSecs, setTestDurationSecs] = useState(30);
    const [slaP99, setSlaP99] = useState(500);
    const [maxErrorRate, setMaxErrorRate] = useState(5);
    const [diffData, setDiffData] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const handleStartTest = useCallback((config) => {
        setTestDurationSecs(config.duration / 1000);
        setSlaP99(config.slaP99 || 500);
        setMaxErrorRate(config.maxErrorRate || 5);
        ws.startTest(config);
        setActivePage('analytics');
    }, [ws]);

    useEffect(() => {
        if (ws.status !== 'completed') return;
        const fetchDiff = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/api/results/diff`, { method: 'POST' });
                const json = await res.json();
                if (res.ok && json.changes) {
                    setDiffData(json.changes.map(c => ({ metric: c.metric, before: c.before, after: c.after, change: c.pctChange ?? 0, improved: c.trend === 'improved' })));
                } else { setDiffData(null); }
            } catch (err) { console.error('[Diff]', err.message); setDiffData(null); }
        };
        fetchDiff();
    }, [ws.status]);

    const isRunning = ws.status === 'running';
    const isCompleted = ws.status === 'completed';

    let progressValue = 0;
    if (isRunning && ws.latestMetrics && typeof ws.latestMetrics.timeLeft === 'number') {
        const timeLeftSecs = ws.latestMetrics.timeLeft / 1000;
        const elapsed = testDurationSecs - timeLeftSecs;
        progressValue = Math.max(0, Math.min(100, (elapsed / testDurationSecs) * 100));
    }

    const pageTitle = {
        analytics: 'Performance Analytics',
        config: 'Test Configuration',
        diagnosis: 'AI Diagnosis',
        alerts: 'Alert Feed',
        settings: 'Settings',
    };

    const renderPage = () => {
        switch (activePage) {
            case 'analytics':
                return (
                    <>
                        <StatCards latestMetrics={ws.latestMetrics} metricsHistory={ws.metricsHistory} />
                        <LatencyChart metricsHistory={ws.metricsHistory} configuredSla={slaP99} />
                        <div className="grid grid-cols-5 gap-5 w-full">
                            <div className="col-span-3">
                                <ThroughputChart metricsHistory={ws.metricsHistory} />
                            </div>
                            <div className="col-span-2">
                                <ErrorRateChart metricsHistory={ws.metricsHistory} maxErrorRate={maxErrorRate} />
                            </div>
                        </div>
                    </>
                );
            case 'config':
                return <TestConfigPage startTest={handleStartTest} status={ws.status} />;
            case 'diagnosis':
                return (
                    <>
                        <DiagnosisPanel
                            status={ws.status} diagnosis={ws.diagnosis}
                            latestMetrics={ws.latestMetrics} target={ws.lastTarget}
                            hasDiff={!!diffData}
                            onToggleComparison={() => setShowComparison(v => !v)}
                            showComparison={showComparison}
                        />
                        {isCompleted && diffData && showComparison && (
                            <div className="glass w-full" style={{ borderLeft: '3px solid #6366f1' }}>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Run Comparison</h2>
                                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Previous run vs latest run</p>
                                        </div>
                                        <button className="text-[11px] px-3 py-1.5 rounded-xl"
                                            style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                                            onClick={() => setShowComparison(false)}>
                                            <span className="flex items-center gap-1"><X className="w-3 h-3" /> Close</span>
                                        </button>
                                    </div>
                                    <RunComparison data={diffData} />
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'alerts':
                return <AlertFeed alerts={ws.alerts} />;
            case 'settings':
                return (
                    <div className="glass p-8 max-w-2xl">
                        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Settings</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Settings page coming soon...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden antialiased relative"
            style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}>

            <NavigationSidebar activePage={activePage} onPageChange={setActivePage} alertCount={ws.alerts?.length || 0} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar connected={ws.connected} status={ws.status} activePage={activePage} alertCount={ws.alerts?.length || 0} onPageChange={setActivePage} />

                {/* Progress bar */}
                {isRunning && (
                    <div className="w-full h-[3px] shrink-0"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="h-full transition-all duration-300"
                            style={{
                                width: `${progressValue}%`,
                                background: 'linear-gradient(90deg, var(--accent), #fb923c)',
                                boxShadow: '0 0 16px rgba(249,115,22,0.4), 0 0 40px rgba(249,115,22,0.15)',
                            }}
                        />
                    </div>
                )}

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 pb-4 max-w-[1400px] w-full">
                        {/* Page title */}
                        <h1 className="text-2xl font-bold tracking-tight mb-5"
                            style={{ color: 'var(--text-primary)' }}>
                            {pageTitle[activePage]}
                        </h1>

                        <div className="space-y-4">
                            {renderPage()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
