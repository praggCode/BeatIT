import React, { useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import LatencyChart from './components/LatencyChart';
import ThroughputChart from './components/ThroughputChart';
import ErrorRateChart from './components/ErrorRateChart';
import AlertFeed from './components/AlertFeed';
import DiagnosisPanel from './components/DiagnosisPanel';

export default function App() {
    const ws = useWebSocket();
    const [testDurationSecs, setTestDurationSecs] = useState(30);
    const [slaP99, setSlaP99] = useState(500);

    const handleStartTest = useCallback((config) => {
        setTestDurationSecs(config.duration / 1000);
        setSlaP99(config.slaP99 || 500);
        ws.startTest(config);
    }, [ws]);

    const isRunning = ws.status === 'running';

    // Calculate progress safely based on timeLeft
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
                    {/* Progress Bar pinned to top of main area, hidden when idle/complete */}
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

                        <DiagnosisPanel status={ws.status} diagnosis={ws.diagnosis} />

                        <AlertFeed alerts={ws.alerts} />
                    </div>
                </main>
            </div>
        </div>
    );
}
