import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket() {
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [latestMetrics, setLatestMetrics] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [diagnosis, setDiagnosis] = useState(null);
    const [lastTarget, setLastTarget] = useState(null);

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        // Prevent reconnecting if already connected OR connecting
        if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;

        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        ws.onclose = () => {
            setConnected(false);
            wsRef.current = null;
            // Reconnect logic if needed, but for local tool maybe just once every few seconds
            reconnectTimeoutRef.current = setTimeout(connect, 2000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                const { type, data } = message;

                switch (type) {
                    case 'connected':
                        // Log connection message
                        console.log(message.message);
                        break;

                    case 'status':
                        if (data?.state) {
                            setStatus(data.state);
                        }
                        if (data?.diagnosis) {
                            setDiagnosis(data.diagnosis);
                        }
                        break;

                    case 'metrics':
                        if (data) {
                            setLatestMetrics(data);
                            setMetricsHistory(prev => [...prev, data]);
                        }
                        break;

                    case 'alert':
                        if (data) {
                            // Map backend metric names to human-readable alert types and messages
                            const alertTypeMap = {
                                'p99': 'Latency',
                                'errorRate': 'Error Rate',
                                'throughput': 'Throughput'
                            };
                            const alertMessageMap = {
                                'p99': `p99 latency is ${data.value}ms, exceeds your ${data.threshold}ms SLA`,
                                'errorRate': `Error rate spiked to ${data.value}%, threshold is ${data.threshold}%`,
                                'throughput': `Throughput dropped to ${data.value} req/s, below ${data.threshold} req/s minimum`
                            };
                            const formattedAlert = {
                                type: alertTypeMap[data.metric] || data.metric,
                                message: alertMessageMap[data.metric] || `${data.metric}: ${data.value} (threshold ${data.threshold})`,
                                severity: data.severity || 'warning',
                                timestamp: Math.round((Date.now() % 100000) / 1000)
                            };
                            setAlerts(prev => [formattedAlert, ...prev]); // Newest on top
                        }
                        break;

                    default:
                        console.warn('Unknown WebSocket message type:', type);
                }
            } catch (err) {
                console.error('Failed to parse WebSocket message', err);
            }
        };

        wsRef.current = ws;
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [connect]);

    const resetTest = useCallback(() => {
        setStatus('idle');
        setMetricsHistory([]);
        setLatestMetrics(null);
        setAlerts([]);
        setDiagnosis(null);
    }, []);

    const startTest = useCallback(async (config) => {
        // config expects: { target, users, duration }
        resetTest();
        setStatus('idle');
        if (config?.target) setLastTarget(config.target);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/test/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                console.error('Failed to start test via API');
                // If API fails immediately, we might want to alert the user or reset
            }
        } catch (err) {
            console.error('API error starting test:', err);
        }
    }, [resetTest]);

    return {
        connected,
        status,
        metricsHistory,
        latestMetrics,
        alerts,
        diagnosis,
        lastTarget,
        startTest,
        resetTest
    };
}
