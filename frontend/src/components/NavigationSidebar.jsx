import React from 'react';
import { LayoutDashboard, BarChart3, Settings2, Brain, Bell, Sliders } from 'lucide-react';
import GradientText from './GradientText';

const navItems = [
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'config', label: 'Test Config', icon: Sliders },
    { key: 'diagnosis', label: 'AI Diagnosis', icon: Brain },
    { key: 'alerts', label: 'Alerts', icon: Bell },
    { key: 'settings', label: 'Settings', icon: Settings2 },
];

export default function NavigationSidebar({ activePage, onPageChange, alertCount = 0 }) {
    return (
        <div className="h-full shrink-0 flex flex-col relative z-10"
            style={{
                width: '220px',
                background: 'var(--glass-bg-1)',
                borderRight: '1px solid var(--glass-border-1)',
            }}>

            {/* Brand */}
            <div className="px-5 py-5 flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #64748b, #475569)',
                        boxShadow: '0 0 20px rgba(100,116,139,0.3)',
                    }}>
                    <span className="text-white text-sm font-bold">B</span>
                </div>
                <GradientText
                    colors={['#ef4444', '#f87171', '#ef4444']}
                    animationSpeed={6}
                    className="text-xl font-bold tracking-tight"
                >
                    BeatIT
                </GradientText>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = activePage === item.key;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.key}
                            onClick={() => onPageChange(item.key)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full"
                            style={{
                                background: isActive
                                    ? 'linear-gradient(135deg, #64748b, #475569)'
                                    : 'transparent',
                                color: isActive ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer',
                                boxShadow: isActive ? '0 0 20px rgba(100,116,139,0.2)' : 'none',
                                border: 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'var(--glass-bg-3)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                            <span className="text-[13px] font-semibold">{item.label}</span>
                            {item.key === 'alerts' && alertCount > 0 && (
                                <span
                                    className="ml-auto flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{
                                        minWidth: '20px',
                                        height: '20px',
                                        padding: '0 5px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        boxShadow: '0 0 12px rgba(239,68,68,0.4)',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }}
                                >
                                    {alertCount > 99 ? '99+' : alertCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
