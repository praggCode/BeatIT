import React from 'react';

export default function Navbar({ connected, status }) {
    const isRunning = status === 'running';

    return (
        <div className="navbar bg-base-200 border-b border-base-300 min-h-[64px] shrink-0 px-6">
            <div className="navbar-start flex items-center gap-4">
                <span className="font-mono text-[20px] text-primary">BeatIT</span>
                <div className="relative flex h-3 w-3">
                    {isRunning ? (
                        <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                        </>
                    ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                    )}
                </div>
            </div>

            <div className="navbar-center">
                {connected ? (
                    <div className="badge badge-success font-mono">LIVE</div>
                ) : (
                    <div className="badge badge-error font-mono">OFFLINE</div>
                )}
            </div>

            <div className="navbar-end">
                {/* Right side explicitly kept clean as per specs */}
            </div>
        </div>
    );
}
