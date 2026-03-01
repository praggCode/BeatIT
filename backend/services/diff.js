const { diff } = require('deep-diff');

/**
 * The numeric metric keys we care about for run comparison.
 */
const METRIC_KEYS = ['p50', 'p95', 'p99', 'throughput', 'errorRate', 'totalRequests', 'totalErrors'];

/**
 * Compute a human-friendly, structured diff between two test run results.
 *
 * @param {object} before  - Result object from an earlier run (shape of `lastResult` in testRunner)
 * @param {object} after   - Result object from the latest run
 * @returns {object}        - { changes, summary, rawDiff }
 */
function compareRuns(before, after) {
    if (!before || !after) {
        throw new Error('Both "before" and "after" results are required for comparison.');
    }

    // ── 1. Raw deep-diff ──────────────────────────────────────────────────────
    const rawDiff = diff(before, after) || [];

    // ── 2. Metric-level summary ───────────────────────────────────────────────
    const changes = METRIC_KEYS.map((key) => {
        const bVal = parseFloat(before[key]);
        const aVal = parseFloat(after[key]);

        const hasValues = !isNaN(bVal) && !isNaN(aVal);
        const delta = hasValues ? +(aVal - bVal).toFixed(2) : null;
        const pctChange = hasValues && bVal !== 0
            ? +((delta / Math.abs(bVal)) * 100).toFixed(1)
            : null;

        // Direction — lower is better for latency/errors, higher is better for throughput/requests
        const lowerIsBetter = ['p50', 'p95', 'p99', 'errorRate', 'totalErrors'].includes(key);
        let trend = 'neutral';
        if (delta !== null && delta !== 0) {
            const improved = lowerIsBetter ? delta < 0 : delta > 0;
            trend = improved ? 'improved' : 'degraded';
        }

        return {
            metric: key,
            before: hasValues ? bVal : before[key],
            after: hasValues ? aVal : after[key],
            delta,
            pctChange,
            trend,
        };
    });

    // ── 3. Human-readable text summary ────────────────────────────────────────
    const improved = changes.filter(c => c.trend === 'improved');
    const degraded = changes.filter(c => c.trend === 'degraded');
    const unchanged = changes.filter(c => c.trend === 'neutral');

    const fmtLine = (c) => {
        const dir = c.delta > 0 ? '+' : '';
        const pct = c.pctChange !== null ? ` (${c.delta > 0 ? '+' : ''}${c.pctChange}%)` : '';
        return `  • ${c.metric}: ${c.before} → ${c.after}  [${dir}${c.delta}${pct}]`;
    };

    let summary = `Run Comparison\n`;
    summary += `Before: ${before.timestamp || 'N/A'}  |  After: ${after.timestamp || 'N/A'}\n`;
    summary += `Target: ${after.target || before.target || 'N/A'}\n\n`;

    if (improved.length) summary += `✅ Improved (${improved.length}):\n${improved.map(fmtLine).join('\n')}\n\n`;
    if (degraded.length) summary += `❌ Degraded (${degraded.length}):\n${degraded.map(fmtLine).join('\n')}\n\n`;
    if (unchanged.length) summary += `➖ Unchanged (${unchanged.length}):\n${unchanged.map(fmtLine).join('\n')}\n`;

    return { changes, summary, rawDiff };
}

module.exports = { compareRuns };
