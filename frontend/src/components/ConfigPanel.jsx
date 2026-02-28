import React from 'react';
import { ChevronDown } from 'lucide-react';

const ConfigPanel = ({ config, onChange, isRunning, onStart }) => {
    return (
        <div className="mb-24 w-full relative z-10">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-1 h-4 bg-theme-accent rounded-full" />
                <h2 className="text-sm font-bold tracking-widest text-[#B0B5BB] uppercase">Tune Config</h2>
            </div>

            <div className="bg-theme-card/60 backdrop-blur-xl rounded-2xl p-6 border border-theme-border/50 shadow-xl w-full">
                {/* Top Row: Method & URL */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="w-full md:w-32 shrink-0">
                        <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-2 ml-1">Method</label>
                        <div className="relative">
                            <select
                                value={config.method}
                                onChange={e => onChange('method', e.target.value)}
                                disabled={isRunning}
                                className="w-full appearance-none bg-theme-hover/60 text-white font-bold text-xs px-4 py-3.5 rounded-xl border border-theme-border/30 focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/50 outline-none cursor-pointer disabled:opacity-50 transition-colors"
                            >
                                {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                                    <option key={m} value={m} className="bg-theme-bg text-white">{m}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-2 ml-1">Endpoint</label>
                        <input
                            type="url"
                            value={config.url}
                            onChange={e => onChange('url', e.target.value)}
                            placeholder="https://api.example.com/v1"
                            disabled={isRunning}
                            className="w-full bg-theme-hover/60 text-white font-mono text-xs px-4 py-3.5 rounded-xl border border-theme-border/30 focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/50 outline-none placeholder:text-theme-muted/50 disabled:opacity-50 transition-colors"
                        />
                    </div>
                </div>

                {/* Sliders Area */}
                <div className="space-y-8 mb-6 relative">
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest ml-1">Concurrency</label>
                        </div>
                        <div className="relative group px-1">
                            <div className="absolute w-full h-[2px] bg-theme-border/50 top-1/2 -translate-y-1/2 rounded-full" />
                            <div
                                className="absolute h-[2px] bg-theme-accent top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                                style={{ width: `${(config.concurrency / 500) * 100}%` }}
                            />
                            <input
                                type="range"
                                min="1"
                                max="500"
                                value={config.concurrency}
                                onChange={e => onChange('concurrency', parseInt(e.target.value))}
                                disabled={isRunning}
                                className="w-full appearance-none bg-transparent relative z-10 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#FFFFE3] [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,227,0.8)]
                  disabled:opacity-50"
                            />
                            <div
                                className="absolute -top-8 -translate-x-1/2 bg-theme-hover/80 border border-theme-border/50 text-white font-bold font-mono text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transition-all opacity-0 group-hover:opacity-100"
                                style={{ left: `${(config.concurrency / 500) * 100}%` }}
                            >
                                {config.concurrency}
                            </div>
                            <div className="absolute right-0 top-0 -translate-y-1/2 bg-theme-hover px-2 py-1 rounded text-[10px] font-mono font-bold text-white border border-theme-border/30 shadow-sm pointer-events-none">
                                50
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-4 pt-4 border-t border-theme-border/20">
                            <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest ml-1">Duration</label>
                        </div>
                        <div className="relative group px-1">
                            <div className="absolute w-full h-[2px] bg-theme-border/50 top-1/2 -translate-y-1/2 rounded-full" />
                            <div
                                className="absolute h-[2px] bg-theme-accent top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                                style={{ width: `${(config.duration / 300) * 100}%` }}
                            />
                            <input
                                type="range"
                                min="10"
                                max="300"
                                step="10"
                                value={config.duration}
                                onChange={e => onChange('duration', parseInt(e.target.value))}
                                disabled={isRunning}
                                className="w-full appearance-none bg-transparent relative z-10 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#FFFFE3] [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,227,0.8)]
                  disabled:opacity-50"
                            />
                            <div
                                className="absolute -top-8 -translate-x-1/2 bg-theme-hover/80 border border-theme-border/50 text-white font-bold font-mono text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transition-all opacity-0 group-hover:opacity-100"
                                style={{ left: `${(config.duration / 300) * 100}%` }}
                            >
                                {config.duration}s
                            </div>
                            <div className="absolute right-0 top-0 -translate-y-1/2 bg-theme-hover px-2 py-1 rounded text-[10px] font-mono font-bold text-white border border-theme-border/30 shadow-sm pointer-events-none">
                                300
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigPanel;
