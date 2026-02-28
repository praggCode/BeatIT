// Mock data generators for BeatIT

export const generateLatency = (activeUsers, elapsedSeconds) => {
    const baseLatency = 45;
    const loadFactor = activeUsers / 100;
    const rampFactor = Math.min(elapsedSeconds / 30, 1);
    const spike = Math.random() > 0.95 ? Math.random() * 1200 : 0;
    const jitter = (Math.random() - 0.5) * 20;
    return Math.max(5, baseLatency * (1 + loadFactor * 0.8 * rampFactor) + spike + jitter);
};

export const generateP95Latency = (p50) => {
    return p50 * (1.8 + Math.random() * 0.6);
};

export const generateP99Latency = (p50) => {
    return p50 * (3.2 + Math.random() * 1.2);
};

export const generateThroughput = (activeUsers, elapsedSeconds) => {
    const maxThroughput = activeUsers * 2.1;
    const rampFactor = Math.min(elapsedSeconds / 10, 1);
    const saturation = activeUsers > 200 ? 0.7 : 1;
    const jitter = (Math.random() - 0.5) * 15;
    return Math.max(0, maxThroughput * rampFactor * saturation + jitter);
};

export const generateErrorRate = (activeUsers, elapsedSeconds) => {
    const baseError = 0.05;
    const loadStress = activeUsers > 150 ? (activeUsers - 150) / 500 : 0;
    const timeStress = elapsedSeconds > 40 ? (elapsedSeconds - 40) / 200 : 0;
    const spike = Math.random() > 0.97 ? Math.random() * 5 : 0;
    return Math.min(25, baseError + loadStress * 8 + timeStress * 3 + spike);
};

export const generateDataPoint = (activeUsers, elapsedSeconds) => {
    const p50 = generateLatency(activeUsers, elapsedSeconds);
    const p95 = generateP95Latency(p50);
    const p99 = generateP99Latency(p50);
    const throughput = generateThroughput(activeUsers, elapsedSeconds);
    const errorRate = generateErrorRate(activeUsers, elapsedSeconds);

    return {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        timestamp: Date.now(),
        p50: Math.round(p50),
        p95: Math.round(p95),
        p99: Math.round(p99),
        throughput: Math.round(throughput),
        errorRate: parseFloat(errorRate.toFixed(2)),
        activeUsers: activeUsers + Math.floor((Math.random() - 0.5) * 5),
    };
};

export const generateHeatmapPoint = (p50, timestamp) => {
    const buckets = ['0-50ms', '50-100ms', '100-200ms', '200-500ms', '500ms+'];
    let bucket;
    if (p50 < 50) bucket = 0;
    else if (p50 < 100) bucket = 1;
    else if (p50 < 200) bucket = 2;
    else if (p50 < 500) bucket = 3;
    else bucket = 4;

    const variance = Math.floor(Math.random() * 3) - 1;
    const finalBucket = Math.max(0, Math.min(4, bucket + variance));

    return {
        time: timestamp,
        bucket: finalBucket,
        bucketLabel: buckets[finalBucket],
        value: p50,
        count: Math.floor(Math.random() * 50) + 5,
    };
};

export const INITIAL_BOTTLENECKS = [
    {
        id: 1,
        type: 'cpu',
        severity: 'critical',
        title: 'CPU Saturation Detected',
        timestamp: '12:34:56',
        metric: 'Response time increased 340%',
        suggestion: 'Scale horizontally or upgrade instance type',
        icon: 'cpu',
    },
    {
        id: 2,
        type: 'database',
        severity: 'warning',
        title: 'Database Connection Pool Exhausted',
        timestamp: '12:35:02',
        metric: 'Timeout rate: 15% — Pool utilization: 100%',
        suggestion: 'Increase pool size (10→50) or add read replicas',
        icon: 'database',
    },
    {
        id: 3,
        type: 'memory',
        severity: 'warning',
        title: 'Memory Pressure Detected',
        timestamp: '12:35:18',
        metric: 'GC pauses averaging 120ms every 5 seconds',
        suggestion: 'Optimize memory usage or increase heap size',
        icon: 'memory',
    },
];

export const INITIAL_SLA_ALERTS = [
    {
        id: 1,
        severity: 'warning',
        title: 'P95 Latency Threshold Exceeded',
        threshold: '200ms',
        actual: '287ms',
        duration: '5.2s',
        timestamp: '12:34:58',
    },
    {
        id: 2,
        severity: 'critical',
        title: 'Error Rate Critical',
        threshold: '1%',
        actual: '8.4%',
        duration: '12s',
        timestamp: '12:35:10',
    },
    {
        id: 3,
        severity: 'warning',
        title: 'Throughput Below SLA',
        threshold: '100 req/s',
        actual: '73 req/s',
        duration: '8.7s',
        timestamp: '12:35:21',
    },
];

export const COMPARISON_DATA = [
    { metric: 'p50 Latency', before: '45ms', after: '38ms', change: -15.6, improved: true },
    { metric: 'p95 Latency', before: '120ms', after: '95ms', change: -20.8, improved: true },
    { metric: 'p99 Latency', before: '450ms', after: '380ms', change: -15.6, improved: true },
    { metric: 'Throughput', before: '85 req/s', after: '110 req/s', change: +29.4, improved: true },
    { metric: 'Error Rate', before: '2.1%', after: '3.8%', change: +81.0, improved: false },
    { metric: 'Active Users', before: '100', after: '150', change: +50.0, improved: true },
];

export const AI_REPORT_CONTENT = `## Executive Summary

Your API handled **5,240 requests** over 60 seconds with a peak throughput of **120 req/s**. The system demonstrated stable performance up to 100 concurrent users, after which degradation was observed.

## Key Findings

- ✅ **P50 latency** remained stable at ~45ms under normal load
- ⚠️ **P99 latency** spiked to 1,200ms under peak load (>150 users)
- 🚨 **Error rate** climbed to 5% after 45 seconds of sustained load
- 📊 **Saturation point** detected at approximately 110 concurrent users

## Root Cause Analysis

Database connection pool saturation was detected at ~100 concurrent users. The connection queue grew exponentially beyond this threshold, causing:

1. Increased wait times for database operations
2. Request timeouts cascading into error spikes
3. Memory pressure from queued requests

## Performance Baseline

| Metric | Value |
|--------|-------|
| Optimal concurrency | 75 users |
| Saturation point | 110 users |
| Breaking point | ~150 users |
| Peak throughput | 120 req/s |

## Recommendations

1. **Increase connection pool size** from 10 → 50 connections
2. **Implement PgBouncer** or similar connection pooler
3. **Add database read replicas** for read-heavy operations
4. **Implement request queuing** with backpressure mechanisms
5. **Add circuit breaker** pattern to prevent cascade failures
6. **Horizontal scaling**: Consider auto-scaling at 80% saturation

## Next Steps

Run a follow-up test after implementing database optimizations to validate the improvements. Target: p99 < 500ms at 200 concurrent users.`;
