import React, { useState } from 'react';
import { Zap, TrendingUp, BarChart3, Play, Loader2 } from 'lucide-react';

export default function Sidebar({ startTest, status }) {
    const [target, setTarget] = useState('');
    const [users, setUsers] = useState(10);
    const [duration, setDuration] = useState(30000);
    const [strategy, setStrategy] = useState('spike');
    const [slaP99, setSlaP99] = useState(500);
    const [minThroughput, setMinThroughput] = useState(10);
    const [maxErrorRate, setMaxErrorRate] = useState(5);

    const isRunning = status === 'running';

    const handleRunTest = () => {
        if (isRunning) return;
        startTest({ target, users, duration, strategy, slaP99, minThroughput, maxErrorRate });
    };

    const strategies = [
        { key: 'spike', label: 'Spike', icon: Zap, desc: 'All users hit simultaneously' },
        { key: 'ramp', label: 'Ramp', icon: TrendingUp, desc: 'Gradually ramp up users' },
        { key: 'step', label: 'Step', icon: BarChart3, desc: 'Add users in fixed steps' },
    ];

    const inputClass = "w-full px-3 py-2.5 rounded-xl text-[13px] font-mono glass-input placeholder:text-white/15";

    return (
        <div className="h-full shrink-0 flex flex-col glass-strong relative z-10"
            style={{
                width: '280px',
                borderRadius: 0,
                borderTop: 'none',
                borderBottom: 'none',
                borderLeft: 'none',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}>

            {/* Top light highlight */}
            <div className="w-full h-px shrink-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

                {/* Target URL */}
                <div>
                    <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-2 block"
                        style={{ color: 'var(--text-muted)' }}>
                        Target URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://api.example.com"
                        className={inputClass}
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        disabled={isRunning}
                    />
                </div>

                {/* Users & Duration */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-2 block"
                            style={{ color: 'var(--text-muted)' }}>
                            Users
                        </label>
                        <input
                            type="number" min="1" max="1000"
                            className={inputClass}
                            value={users}
                            onChange={(e) => setUsers(Number(e.target.value))}
                            disabled={isRunning}
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-2 block"
                            style={{ color: 'var(--text-muted)' }}>
                            Duration
                        </label>
                        <select
                            className={inputClass + ' cursor-pointer appearance-none'}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            disabled={isRunning}
                        >
                            <option value={10000}>10s</option>
                            <option value={30000}>30s</option>
                            <option value={60000}>60s</option>
                            <option value={120000}>120s</option>
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

                {/* SLA Thresholds */}
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3 flex items-center gap-2"
                        style={{ color: 'var(--accent)' }}>
                        <div className="w-1 h-3.5 rounded-full"
                            style={{ background: 'linear-gradient(180deg, var(--accent), transparent)' }} />
                        SLA Thresholds
                    </div>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-[10px] mb-1.5 block" style={{ color: 'var(--text-muted)' }}>p99 Latency (ms)</label>
                            <input type="number" min="50" max="30000" className={inputClass}
                                value={slaP99} onChange={(e) => setSlaP99(Number(e.target.value))} disabled={isRunning} />
                        </div>
                        <div>
                            <label className="text-[10px] mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Min Throughput (req/s)</label>
                            <input type="number" min="1" max="10000" className={inputClass}
                                value={minThroughput} onChange={(e) => setMinThroughput(Number(e.target.value))} disabled={isRunning} />
                        </div>
                        <div>
                            <label className="text-[10px] mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Max Error Rate (%)</label>
                            <input type="number" min="0" max="100" step="0.5" className={inputClass}
                                value={maxErrorRate} onChange={(e) => setMaxErrorRate(Number(e.target.value))} disabled={isRunning} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

                {/* Load Strategy */}
                <div>
                    <label className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block"
                        style={{ color: 'var(--text-muted)' }}>
                        Load Strategy
                    </label>
                    <div className="flex flex-col gap-2">
                        {strategies.map((strat) => {
                            const isActive = strategy === strat.key;
                            const Icon = strat.icon;
                            return (
                                <button
                                    key={strat.key}
                                    onClick={() => !isRunning && setStrategy(strat.key)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-250 text-left"
                                    style={{
                                        background: isActive
                                            ? 'rgba(249,115,22,0.08)'
                                            : 'rgba(255,255,255,0.02)',
                                        border: isActive
                                            ? '1px solid rgba(249,115,22,0.25)'
                                            : '1px solid rgba(255,255,255,0.04)',
                                        cursor: isRunning ? 'not-allowed' : 'pointer',
                                        boxShadow: isActive ? '0 0 20px rgba(249,115,22,0.06)' : 'none',
                                    }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                        style={{
                                            background: isActive ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                                        }}>
                                        <Icon className="w-3.5 h-3.5"
                                            style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-semibold"
                                            style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                            {strat.label}
                                        </div>
                                        <div className="text-[10px] leading-snug mt-0.5"
                                            style={{ color: 'var(--text-muted)' }}>
                                            {strat.desc}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Run button */}
            <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <button
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden"
                    style={{
                        background: isRunning
                            ? 'rgba(255,255,255,0.04)'
                            : 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #f97316 100%)',
                        backgroundSize: '200% auto',
                        boxShadow: isRunning ? 'none' : '0 0 30px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                        border: isRunning ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        color: '#fff',
                        letterSpacing: '0.05em',
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        opacity: isRunning ? 0.5 : 1,
                        animation: isRunning ? 'none' : 'shimmer 3s linear infinite',
                    }}
                    onClick={handleRunTest}
                    disabled={isRunning}
                    onMouseEnter={e => { if (!isRunning) e.currentTarget.style.boxShadow = '0 0 40px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
                    onMouseLeave={e => { if (!isRunning) e.currentTarget.style.boxShadow = '0 0 30px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
                >
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
            </div>
        </div>
    );
}
