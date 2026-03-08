import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export default function AlertFeed({ alerts }) {
    const criticalCount = alerts?.filter(a => a.severity === 'critical').length || 0;
    const warningCount = alerts?.filter(a => a.severity !== 'critical').length || 0;

    return (
        <div className="glass w-full" style={{ minHeight: 'calc(100vh - 180px)' }}>
            <div className="p-4 px-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            Alerts
                        </h2>
                        {alerts?.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                {criticalCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold"
                                        style={{ background: 'rgba(248,113,113,0.08)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.15)', backdropFilter: 'blur(8px)' }}>
                                        {criticalCount} critical
                                    </span>
                                )}
                                {warningCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold"
                                        style={{ background: 'rgba(251,191,36,0.08)', color: 'var(--warning)', border: '1px solid rgba(251,191,36,0.15)', backdropFilter: 'blur(8px)' }}>
                                        {warningCount} warning
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {!alerts?.length && (
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                            style={{ background: 'rgba(52,211,153,0.06)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.12)', backdropFilter: 'blur(8px)' }}>
                            <ShieldCheck size={12} />
                            HEALTHY
                        </span>
                    )}
                </div>

                <div className="w-full flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                    {(!alerts || alerts.length === 0) ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                                    style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.1)' }}>
                                    <ShieldCheck size={18} style={{ color: 'var(--success)', opacity: 0.5 }} />
                                </div>
                                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>No alerts — system healthy</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {alerts.map((alert, idx) => {
                                const isCritical = alert.severity === 'critical';
                                const accentColor = isCritical ? 'var(--error)' : 'var(--warning)';
                                const Icon = isCritical ? XCircle : AlertTriangle;
                                const glowColor = isCritical ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.08)';

                                return (
                                    <motion.div
                                        key={`${alert.type}-${alert.timestamp || idx}`}
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="rounded-xl flex items-start gap-3 p-3 transition-colors duration-200"
                                        style={{
                                            background: glowColor,
                                            borderLeft: `3px solid`,
                                            borderLeftColor: accentColor,
                                            border: `1px solid ${isCritical ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)'}`,
                                            borderLeftWidth: '3px',
                                            boxShadow: `-4px 0 15px ${glowColor}`,
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono font-bold text-[12px] tracking-tight truncate" style={{ color: accentColor }}>
                                                    {alert.type}
                                                </span>
                                                {alert.timestamp !== undefined && (
                                                    <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                                                        {alert.timestamp}s
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                                                {alert.message}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
