import React, { useState } from 'react';
import { Zap, TrendingUp, BarChart3, Play, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

export default function TestConfigPage({ startTest, status }) {
    const [target, setTarget] = useState('');
    const [method, setMethod] = useState('GET');
    const [users, setUsers] = useState(10);
    const [duration, setDuration] = useState(30000);
    const [strategy, setStrategy] = useState('spike');
    const [slaP99, setSlaP99] = useState(500);
    const [minThroughput, setMinThroughput] = useState(10);
    const [maxErrorRate, setMaxErrorRate] = useState(5);
    const { isLoggedIn } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const isRunning = status === 'running';

    const handleRunTest = () => {
        if (isRunning) return;
        if (!isLoggedIn) {
            setIsLoginModalOpen(true);
            return;
        }
        startTest({ target, method, users, duration, strategy, slaP99, minThroughput, maxErrorRate });
    };

    const strategies = [
        { key: 'spike', label: 'Spike', icon: Zap, desc: 'All users hit simultaneously' },
        { key: 'ramp', label: 'Ramp', icon: TrendingUp, desc: 'Gradually ramp up users' },
        { key: 'step', label: 'Step', icon: BarChart3, desc: 'Add users in fixed steps' },
    ];

    const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] font-mono glass-input placeholder:text-white/15";

    return (
        <div className="w-full space-y-4">
            {/* Target URL */}
            <div className="glass p-4 px-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Target Endpoint</h3>
                <div className="flex gap-2">
                    <div className="flex gap-1 shrink-0">
                        {['GET', 'POST', 'PUT', 'DELETE'].map((m) => {
                            const isActive = method === m;
                            const colorMap = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' };
                            return (
                                <button key={m} onClick={() => !isRunning && setMethod(m)}
                                    className="px-3 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200"
                                    style={{
                                        background: isActive ? `${colorMap[m]}20` : 'rgba(255,255,255,0.03)',
                                        border: isActive ? `1px solid ${colorMap[m]}50` : '1px solid rgba(255,255,255,0.06)',
                                        color: isActive ? colorMap[m] : 'var(--text-muted)',
                                        cursor: isRunning ? 'not-allowed' : 'pointer',
                                    }}>
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="https://api.example.com/v1/endpoint"
                            className={inputClass + (!isLoggedIn ? ' pr-10 cursor-pointer pointer-events-none' : '')}
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            disabled={isRunning}
                        />
                        {/* Invisible overlay to catch clicks if not logged in */}
                        {!isLoggedIn && (
                            <div
                                className="absolute inset-0 cursor-pointer z-10 rounded-xl"
                                onClick={() => !isRunning && setIsLoginModalOpen(true)}
                            />
                        )}
                        {!isLoggedIn && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-white/40">
                                <Lock className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Load Parameters */}
            <div className="glass p-4 px-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Load Parameters</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-1.5 block"
                            style={{ color: 'var(--text-muted)' }}>Concurrent Users</label>
                        <input type="number" min="1" max="1000" className={inputClass}
                            value={users} onChange={(e) => setUsers(Number(e.target.value))} disabled={isRunning} />
                    </div>
                    <div>
                        <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-1.5 block"
                            style={{ color: 'var(--text-muted)' }}>Duration</label>
                        <select className={inputClass + ' cursor-pointer appearance-none'}
                            value={duration} onChange={(e) => setDuration(Number(e.target.value))} disabled={isRunning}>
                            <option value={10000}>10 seconds</option>
                            <option value={30000}>30 seconds</option>
                            <option value={60000}>60 seconds</option>
                            <option value={120000}>120 seconds</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SLA Thresholds */}
            <div className="glass p-4 px-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-3.5 rounded-full" style={{ background: 'linear-gradient(180deg, #94a3b8, transparent)' }} />
                    <h3 className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>SLA Thresholds</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-muted)' }}>p99 Latency (ms)</label>
                        <input type="number" min="50" max="30000" className={inputClass}
                            value={slaP99} onChange={(e) => setSlaP99(Number(e.target.value))} disabled={isRunning} />
                    </div>
                    <div>
                        <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-muted)' }}>Min Throughput (req/s)</label>
                        <input type="number" min="1" max="10000" className={inputClass}
                            value={minThroughput} onChange={(e) => setMinThroughput(Number(e.target.value))} disabled={isRunning} />
                    </div>
                    <div>
                        <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-muted)' }}>Max Error Rate (%)</label>
                        <input type="number" min="0" max="100" step="0.5" className={inputClass}
                            value={maxErrorRate} onChange={(e) => setMaxErrorRate(Number(e.target.value))} disabled={isRunning} />
                    </div>
                </div>
            </div>

            {/* Load Strategy */}
            <div className="glass p-4 px-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Load Strategy</h3>
                <div className="grid grid-cols-3 gap-3">
                    {strategies.map((strat) => {
                        const isActive = strategy === strat.key;
                        const Icon = strat.icon;
                        return (
                            <button key={strat.key} onClick={() => !isRunning && setStrategy(strat.key)}
                                className="flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all duration-200 text-center"
                                style={{
                                    background: isActive ? 'rgba(148,163,184,0.1)' : 'rgba(255,255,255,0.02)',
                                    border: isActive ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(255,255,255,0.04)',
                                    cursor: isRunning ? 'not-allowed' : 'pointer',
                                    boxShadow: isActive ? '0 0 25px rgba(148,163,184,0.08)' : 'none',
                                }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: isActive ? 'rgba(148,163,184,0.15)' : 'rgba(255,255,255,0.04)' }}>
                                    <Icon className="w-4.5 h-4.5" style={{ color: isActive ? '#e2e8f0' : 'var(--text-muted)' }} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold" style={{ color: isActive ? '#e2e8f0' : 'var(--text-secondary)' }}>{strat.label}</div>
                                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{strat.desc}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Run button */}
            <button className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden"
                style={{
                    background: isRunning ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #475569 0%, #334155 50%, #475569 100%)',
                    backgroundSize: '200% auto',
                    boxShadow: isRunning ? 'none' : '0 0 30px rgba(71,85,105,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: isRunning ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(148,163,184,0.2)',
                    color: '#fff', letterSpacing: '0.05em',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    opacity: isRunning ? 0.5 : 1,
                    animation: isRunning ? 'none' : 'shimmer 3s linear infinite',
                }}
                onClick={handleRunTest} disabled={isRunning}>
                {isRunning ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" fill="currentColor" />
                        Run Test
                    </span>
                )}
            </button>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
