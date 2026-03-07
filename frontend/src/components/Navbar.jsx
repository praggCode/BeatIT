import React from 'react';
import GradientText from './GradientText';

export default function Navbar({ connected, status }) {
    const isRunning = status === 'running';

    return (
        <div className="w-full shrink-0 px-6 flex items-center justify-between glass-strong relative z-10"
            style={{
                height: '56px',
                borderRadius: 0,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
            }}>
            {/* Brand */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center relative"
                        style={{
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            boxShadow: '0 0 20px rgba(249,115,22,0.3)',
                        }}>
                        <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <GradientText
                        colors={['#f97316', '#fbbf24', '#f97316']}
                        animationSpeed={6}
                        className="text-xl font-bold tracking-tight"
                    >
                        BeatIT
                    </GradientText>
                </div>
                <div className="relative flex h-2 w-2 ml-1">
                    {isRunning ? (
                        <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: 'var(--success)' }}></span>
                            <span className="relative inline-flex rounded-full h-2 w-2"
                                style={{ backgroundColor: 'var(--success)' }}></span>
                        </>
                    ) : (
                        <span className="relative inline-flex rounded-full h-2 w-2"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}></span>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
                <span className="text-[11px] tracking-[0.2em] font-medium"
                    style={{ color: 'var(--text-muted)' }}>
                    PAGES
                </span>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>/</span>
                <span className="text-[11px] tracking-[0.2em] font-medium"
                    style={{ color: 'var(--text-secondary)' }}>
                    DASHBOARD
                </span>
            </div>

            {/* Status badge */}
            <div>
                {connected ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold pulse-ring"
                        style={{
                            background: 'rgba(52,211,153,0.08)',
                            color: 'var(--success)',
                            border: '1px solid rgba(52,211,153,0.2)',
                            backdropFilter: 'blur(10px)',
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }}></span>
                        LIVE
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold"
                        style={{
                            background: 'rgba(248,113,113,0.08)',
                            color: 'var(--error)',
                            border: '1px solid rgba(248,113,113,0.2)',
                            backdropFilter: 'blur(10px)',
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--error)' }}></span>
                        OFFLINE
                    </div>
                )}
            </div>
        </div>
    );
}
