import React, { useState } from 'react';

export default function Sidebar({ startTest, status }) {
    const [target, setTarget] = useState('');
    const [users, setUsers] = useState(10);
    const [duration, setDuration] = useState(30000); // default 30s
    const [strategy, setStrategy] = useState('spike');
    const [slaP99, setSlaP99] = useState(500);       // default 500ms
    const [minThroughput, setMinThroughput] = useState(10); // default 10 req/s
    const [maxErrorRate, setMaxErrorRate] = useState(5);    // default 5%

    const isRunning = status === 'running';

    const handleRunTest = () => {
        if (isRunning) return;
        startTest({ target, users, duration, strategy, slaP99, minThroughput, maxErrorRate });
    };

    const strategyDescriptions = {
        spike: 'All users hit at once',
        ramp: 'Gradually ramp up users',
        step: 'Add users in fixed steps',
    };

    return (
        <div className="card bg-base-200 w-[300px] h-full rounded-none shrink-0 border-r border-base-300 flex flex-col">
            {/* Scrollable form area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium text-base-content">Target URL</span>
                    </label>
                    <input
                        type="text"
                        placeholder="https://api.example.com/endpoint"
                        className="input input-bordered input-sm w-full font-mono text-sm"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        disabled={isRunning}
                    />
                </div>

                <div className="divider my-1"></div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium text-base-content">Virtual Users</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="1000"
                        className="input input-bordered input-sm w-full font-mono text-sm"
                        value={users}
                        onChange={(e) => setUsers(Number(e.target.value))}
                        disabled={isRunning}
                    />
                </div>

                <div className="divider my-1"></div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium text-base-content">Duration</span>
                    </label>
                    <select
                        className="select select-bordered select-sm w-full font-mono text-sm"
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

                <div className="divider my-1"></div>

                {/* SLA Thresholds Section */}
                <div className="form-control w-full">
                    <label className="label pb-0">
                        <span className="label-text font-medium text-base-content text-xs uppercase tracking-widest">SLA Thresholds</span>
                    </label>
                </div>

                <div className="form-control w-full mt-1">
                    <label className="label py-0.5">
                        <span className="label-text text-xs text-base-content/70">Max p99 Latency (ms)</span>
                    </label>
                    <input
                        type="number"
                        min="50"
                        max="30000"
                        className="input input-bordered input-sm w-full font-mono text-sm"
                        value={slaP99}
                        onChange={(e) => setSlaP99(Number(e.target.value))}
                        disabled={isRunning}
                    />
                </div>

                <div className="form-control w-full mt-1">
                    <label className="label py-0.5">
                        <span className="label-text text-xs text-base-content/70">Min Throughput (req/s)</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10000"
                        className="input input-bordered input-sm w-full font-mono text-sm"
                        value={minThroughput}
                        onChange={(e) => setMinThroughput(Number(e.target.value))}
                        disabled={isRunning}
                    />
                </div>

                <div className="form-control w-full mt-1">
                    <label className="label py-0.5">
                        <span className="label-text text-xs text-base-content/70">Max Error Rate (%)</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        className="input input-bordered input-sm w-full font-mono text-sm"
                        value={maxErrorRate}
                        onChange={(e) => setMaxErrorRate(Number(e.target.value))}
                        disabled={isRunning}
                    />
                </div>

                <div className="divider my-1"></div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium text-base-content mb-1">Load Strategy</span>
                    </label>
                    <div className="tabs tabs-boxed w-full p-1 bg-base-300 grid grid-cols-3">
                        {['spike', 'ramp', 'step'].map((strat) => (
                            <a
                                key={strat}
                                className={`tab tab-sm capitalize ${strategy === strat ? 'tab-active bg-primary text-base-100 font-medium' : 'text-base-content'}`}
                                onClick={() => !isRunning && setStrategy(strat)}
                            >
                                {strat}
                            </a>
                        ))}
                    </div>
                    <p className="text-[10px] text-base-content/40 mt-1.5 ml-0.5">{strategyDescriptions[strategy]}</p>
                </div>

            </div>

            {/* Always-visible Run button pinned to bottom */}
            <div className="p-4 border-t border-base-300 bg-base-200">
                <button
                    style={{
                        background: isRunning ? undefined : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        boxShadow: isRunning ? undefined : '0 0 16px rgba(34,197,94,0.35)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        transition: 'box-shadow 0.2s, transform 0.1s',
                    }}
                    className="btn w-full disabled:opacity-60"
                    onClick={handleRunTest}
                    disabled={isRunning}
                    onMouseEnter={e => { if (!isRunning) e.currentTarget.style.boxShadow = '0 0 24px rgba(34,197,94,0.55)'; }}
                    onMouseLeave={e => { if (!isRunning) e.currentTarget.style.boxShadow = '0 0 16px rgba(34,197,94,0.35)'; }}
                >
                    {isRunning ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Running...
                        </>
                    ) : (
                        '▶  Run Test'
                    )}
                </button>
            </div>
        </div>
    );
}
