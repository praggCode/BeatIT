import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import ConfigPanel from './components/ConfigPanel';
import TopSummary from './components/TopSummary';
import MetricsDashboard from './components/MetricsDashboard';
import BottomNav from './components/BottomNav';
import Ballpit from './components/Ballpit';
import DarkVeil from './components/DarkVeil';
import Home from './components/Home';
import { generateDataPoint } from './utils/mockData';

function App() {
    // Top Level Routing State
    const [currentRoute, setCurrentRoute] = useState('home');

    const [status, setStatus] = useState('idle');

    const [config, setConfig] = useState({
        url: 'https://api.example.com/v1',
        method: 'GET',
        concurrency: 50,
        duration: 300,
    });

    const [chartData, setChartData] = useState([]);
    const [latestData, setLatestData] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    const handleConfigChange = useCallback((field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    }, []);

    const stopTest = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus('completed');
    }, []);

    const startTest = useCallback(() => {
        setChartData([]);
        setLatestData(null);
        setElapsedTime(0);
        setStatus('running');
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const msElapsed = Date.now() - startTimeRef.current;
            const secElapsed = msElapsed / 1000;

            setElapsedTime(secElapsed);

            if (secElapsed >= config.duration) {
                stopTest();
                return;
            }

            const newData = generateDataPoint(config.concurrency, secElapsed);

            setLatestData(newData);
            setChartData(prev => {
                const updated = [...prev, newData];
                if (updated.length > 60) return updated.slice(updated.length - 60);
                return updated;
            });

        }, 1000);
    }, [config.concurrency, config.duration, stopTest]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-theme-bg font-sans selection:bg-theme-accent/30 relative overflow-x-hidden">

            {/* Background Layer: conditional based on route */}
            {currentRoute === 'home' ? (
                <div className="fixed inset-0 pointer-events-none z-0">
                    <DarkVeil
                        color="#000000"
                        particleColor="#FFFFFF"
                        particleCount={100}
                    />
                </div>
            ) : (
                <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
                    <Ballpit
                        count={50}
                        gravity={0.7}
                        friction={0.8}
                        wallBounce={0.95}
                        followCursor={true}
                        colors={[0x6CA2C8, 0x34D399, 0x454950]}
                    />
                </div>
            )}

            {/* Navbar floats above everything */}
            <Navbar
                status={status}
                currentRoute={currentRoute}
                onNavigate={setCurrentRoute}
            />

            {/* Main Application Container */}
            {currentRoute === 'home' ? (
                <main className="w-full relative z-10 pt-20">
                    <Home onNavigate={setCurrentRoute} />
                </main>
            ) : (
                <main className="w-full relative z-10 pt-28 pb-28 2xl:max-w-[1920px] 2xl:mx-auto">
                    <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-8 flex flex-col items-center">
                        <div className="w-full flex-col flex gap-8">
                            <TopSummary data={latestData} chartData={chartData} />

                            <MetricsDashboard latestData={latestData} chartData={chartData} />

                            <ConfigPanel
                                config={config}
                                onChange={handleConfigChange}
                                isRunning={status === 'running'}
                                onStart={startTest}
                            />

                            {/* Test Controls */}
                            <div className="flex justify-end w-full px-2 mt-4 relative z-20">
                                <button
                                    onClick={status === 'running' ? stopTest : startTest}
                                    className={`px-12 py-4 rounded-xl font-bold tracking-widest text-xs uppercase transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${status === 'running'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                        : 'bg-theme-accent text-[#1D2125] hover:bg-theme-accent/90 border border-theme-accent/50 shadow-[0_0_20px_rgba(108,162,200,0.4)]'
                                        }`}
                                >
                                    {status === 'running' ? 'Stop Test' : 'Start Test'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {currentRoute !== 'home' && <BottomNav />}
        </div>
    );
}

export default App;
