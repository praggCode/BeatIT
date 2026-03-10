import React from 'react';
import { Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

export default function TopBar({ connected, status, activePage, alertCount = 0, onPageChange }) {
    const { isLoggedIn, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
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
                borderBottom: '1px solid var(--glass-border-1)',
                background: 'var(--glass-bg-1)',
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
                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative"
                    title="Toggle Theme"
                    style={{
                        background: 'var(--glass-bg-3)',
                        border: '1px solid var(--glass-border-1)',
                        cursor: 'pointer',
                    }}
                    onClick={toggleTheme}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg-3)'}
                >
                    {theme === 'dark' ? (
                        <Moon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                        <Sun className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    )}
                </button>

                <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative"
                    style={{
                        background: 'var(--glass-bg-3)',
                        border: '1px solid var(--glass-border-1)',
                        cursor: 'pointer',
                    }}
                    onClick={() => onPageChange && onPageChange('alerts')}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg-3)'}
                >
                    <Bell className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    {alertCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                minWidth: '18px',
                                height: '18px',
                                padding: '0 4px',
                                borderRadius: '9px',
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                                color: '#fff',
                                fontSize: '10px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1',
                                animation: 'pulse 2s ease-in-out infinite',
                            }}
                        >
                            {alertCount > 99 ? '99+' : alertCount}
                        </span>
                    )}
                </button>
                {isLoggedIn && (
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                        title="Logout"
                        onClick={logout}
                        style={{
                            background: 'var(--glass-bg-3)',
                            border: '1px solid var(--glass-border-1)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-bg-3)'}
                    >
                        <User className="w-4 h-4 hover:hidden" style={{ color: 'var(--text-muted)' }} />
                        <LogOut className="w-4 h-4 hidden hover:block" style={{ color: 'var(--text-muted)' }} />
                    </button>
                )}
            </div>
        </div>
    );
}
