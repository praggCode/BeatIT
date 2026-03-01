import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle } from 'lucide-react';

export default function AlertFeed({ alerts }) {
    return (
        <div className="card bg-base-200 w-full shrink-0 border border-base-300">
            <div className="card-body p-4">
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="card-title text-base-content text-sm ml-2">Alerts</h2>
                    <div className="badge badge-neutral font-mono">{alerts?.length || 0}</div>
                </div>

                <div className="w-full flex flex-col gap-2 overflow-y-auto max-h-[300px] min-h-[60px] pr-1">
                    {(!alerts || alerts.length === 0) ? (
                        <div className="flex items-center justify-center h-full text-base-content/40 text-sm mt-4">
                            No alerts — system healthy
                        </div>
                    ) : (
                        <AnimatePresence>
                            {alerts.map((alert, idx) => {
                                // Determine styling
                                const isCritical = alert.severity === 'critical';
                                const alertClass = isCritical ? 'alert-error' : 'alert-warning';
                                const Icon = isCritical ? XCircle : AlertTriangle;

                                // Unique ID for framer motion if not supplied; we'll assume array index for now,
                                // but strictly speaking a true ID from backend is better. 
                                // Using alert type + message as an ID substitute, but reversing for newest on top is already done in hook.
                                return (
                                    <motion.div
                                        key={`${alert.type}-${alert.timestamp || idx}`}
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className={`alert ${alertClass} rounded-lg shadow-sm`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono font-bold text-sm tracking-tight">{alert.type}</span>
                                                {alert.timestamp !== undefined && (
                                                    <span className="text-xs opacity-70 font-mono">{alert.timestamp}s</span>
                                                )}
                                            </div>
                                            <span className="text-sm opacity-90 mt-0.5">{alert.message}</span>
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
