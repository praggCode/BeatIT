import React, { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import LatencyChart from './components/LatencyChart';
import ThroughputChart from './components/ThroughputChart';
import ErrorRateChart from './components/ErrorRateChart';
import AlertFeed from './components/AlertFeed';
import DiagnosisPanel from './components/DiagnosisPanel';
import RunComparison from './components/RunComparison';

export default function App() {
    const ws = useWebSocket();
    const [testDurationSecs, setTestDurationSecs] = useState(30);
    const [slaP99, setSlaP99] = useState(500);
    const [diffData, setDiffData] = useState(null);
    const [diffError, setDiffError] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const handleStartTest = useCallback((config) => {
        setTestDurationSecs(config.duration / 1000);
        setSlaP99(config.slaP99 || 500);
        ws.startTest(config);
    }, [ws]);

    useEffect(() => {
        if (ws.status !== 'completed') return;

        const fetchDiff = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/api/results/diff`, { method: 'POST' });
                const json = await res.json();

                if (res.ok && json.changes) {
                    const shaped = json.changes.map(c => ({
                        metric: c.metric,
                        before: c.before,
                        after: c.after,
                        change: c.pctChange ?? 0,
                        improved: c.trend === 'improved',
                    }));
                    setDiffData(shaped);
                    setDiffError(null);
                } else {
                    console.log('[Diff] Not ready yet:', json.error);
                    setDiffData(null);
                    setDiffError(null);
                }
            } catch (err) {
                console.error('[Diff] Fetch failed:', err.message);
                setDiffData(null);
            }
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

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-base-100 text-base-content antialiased">
            <Navbar connected={ws.connected} status={ws.status} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar startTest={handleStartTest} status={ws.status} />

                <main className="flex-1 overflow-y-auto relative bg-base-100">
                    {isRunning && (
                        <progress
                            className="progress progress-primary w-full h-1 sticky top-0 z-50 rounded-none bg-base-300"
                            value={progressValue}
                            max="100"
                        ></progress>
                    )}

                    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full pb-12">
                        <StatCards
                            latestMetrics={ws.latestMetrics}
                            metricsHistory={ws.metricsHistory}
                            configuredSla={slaP99}
                        />

                        <LatencyChart
                            metricsHistory={ws.metricsHistory}
                            configuredSla={slaP99}
                        />

                        <div className="flex gap-6 w-full">
                            <div className="w-[60%] shrink-0">
                                <ThroughputChart metricsHistory={ws.metricsHistory} />
                            </div>
                            <div className="w-[40%] shrink-0">
                                <ErrorRateChart metricsHistory={ws.metricsHistory} />
                            </div>
                        </div>

                        <DiagnosisPanel
                            status={ws.status}
                            diagnosis={ws.diagnosis}
                            latestMetrics={ws.latestMetrics}
                            target={ws.lastTarget}
                            hasDiff={!!diffData}
                            onToggleComparison={() => setShowComparison(v => !v)}
                            showComparison={showComparison}
                        />


                        {isCompleted && diffData && showComparison && (
                            <div className="card bg-base-200 border-l-4 border-secondary w-full shadow-lg">
                                <div className="card-body p-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="font-mono text-xl text-base-content tracking-tight">
                                                Run Comparison
                                            </h2>
                                            <p className="text-xs text-base-content/40 mt-0.5">Previous run vs latest run</p>
                                        </div>
                                        <button
                                            className="btn btn-xs btn-ghost text-base-content/40"
                                            onClick={() => setShowComparison(false)}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>
                                    <RunComparison data={diffData} />
                                </div>
                            </div>
                        )}

                        <AlertFeed alerts={ws.alerts} />
                    </div>
                </main>
            </div>
        </div>
    );
}
