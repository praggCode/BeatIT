import React from 'react';
import { Bell, User } from 'lucide-react';

export default function TopBar({ connected, status, activePage }) {
    const isRunning = status === 'running';

    const pageLabels = {
        dashboard: 'Dashboard',
        analytics: 'Analytics',
        config: 'Test Config',
        diagnosis: 'AI Diagnosis',
        alerts: 'Alerts',
        settings: 'Settings',
    };

    const pageTitle = {
        dashboard: 'Dashboard Overview',
        analytics: 'Performance Analytics',
        config: 'Test Configuration',
        diagnosis: 'AI Diagnosis',
        alerts: 'Alert Feed',
        settings: 'Settings',
    };

    return (
        <div className="w-full shrink-0 px-6 flex items-center justify-between relative z-10"
            style={{
                height: '56px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
            }}>
            {/* Left: LIVE badge + breadcrumb */}
            <div className="flex items-center gap-5">
                {/* LIVE badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold"
                    style={{
                        background: connected
                            ? 'rgba(52,211,153,0.12)'
                            : 'rgba(248,113,113,0.12)',
                        color: connected ? 'var(--success)' : 'var(--error)',
                        border: connected
                            ? '1px solid rgba(52,211,153,0.25)'
                            : '1px solid rgba(248,113,113,0.25)',
                    }}>
                    <span className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: connected ? 'var(--success)' : 'var(--error)',
                            boxShadow: connected ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
                        }}></span>
                    {connected ? 'LIVE' : 'OFFLINE'}
                </div>

                {/* Breadcrumb + Title */}
                <div>
                    <div className="text-[11px] tracking-wide"
                        style={{ color: 'var(--text-muted)' }}>
                        Pages / <span style={{ color: 'var(--text-secondary)' }}>{pageLabels[activePage]}</span>
                    </div>
                </div>
            </div>

            {/* Right: icons */}
            <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                >
                    <Bell className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                >
                    <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>
        </div>
    );
}
