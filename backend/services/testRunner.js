const Piscina = require('piscina');
const path = require('path');
const { broadcast } = require('../ws/socket');
const { emitter, checkSLA } = require('./sla');
const { diagnose } = require('./ai');

const pool = new Piscina({
  filename: path.resolve(__dirname, '../workers/loadWorker.js'),
  maxThreads: 50,
});

emitter.on('breach', (data) => {
  broadcast({ type: 'alert', data });
});

let lastResult = null;
let runHistory = [];   // always stores the last 2 completed runs

function getLastResult() { return lastResult; }
function getRunHistory() { return runHistory; }

/**
 * Calculate how many virtual users should be active at a given elapsed time.
 * - spike:  All users from second 0
 * - ramp:   Linearly increase from 1 to users over the duration
 * - step:   Add users in equal chunks every 20% of the duration
 */
function getActiveUsers(strategy, totalUsers, elapsed, totalDuration) {
  if (strategy === 'ramp') {
    const progress = Math.min(elapsed / totalDuration, 1);
    return Math.max(1, Math.ceil(totalUsers * progress));
  }

  if (strategy === 'step') {
    const steps = 5; // 5 steps
    const stepDuration = totalDuration / steps;
    const currentStep = Math.min(Math.floor(elapsed / stepDuration) + 1, steps);
    return Math.max(1, Math.ceil(totalUsers * (currentStep / steps)));
  }

  // spike (default): all users immediately
  return totalUsers;
}

async function runTest({ target, method = 'GET', users, duration, strategy = 'spike', slaP99, minThroughput = 10, maxErrorRate = 5 }) {
  broadcast({ type: 'status', data: { state: 'running' } });

  const startTime = Date.now();
  const endTime = startTime + duration;
  let totalRequests = 0;
  let totalErrors = 0;
  let lastMetrics = {};

  let isRunning = true;
  let activeWorkers = 0;

  let batchRequests = 0;
  let batchErrors = 0;
  let latencies = [];

  const interval = setInterval(async () => {
    if (Date.now() >= endTime) {
      clearInterval(interval);
      isRunning = false;

      await new Promise(resolve => setTimeout(resolve, 500));

      let diagnosis;
      try {
        if (!process.env.GEMINI_API_KEY) {
          diagnosis = "Diagnostics skipped: GEMINI_API_KEY is not configured in backend/.env";
        } else {
          diagnosis = await diagnose({
            totalRequests,
            totalErrors,
            ...lastMetrics
          });
        }
      } catch (err) {
        console.error('Diagnosis failed:', err);
        diagnosis = "Diagnosis analysis failed.";
      }

      lastResult = {
        target,
        totalRequests,
        totalErrors,
        ...lastMetrics,
        diagnosis,
        timestamp: new Date().toISOString(),
      };

      runHistory = [...runHistory.slice(-1), lastResult];

      broadcast({ type: 'status', data: { state: 'completed', diagnosis } });
      return;
    }

    const elapsed = Date.now() - startTime;
    const targetUsers = getActiveUsers(strategy, users, elapsed, duration);

    while (activeWorkers < targetUsers && isRunning) {
      activeWorkers++;
      pool.run({ target, method, requests: 1 }).then((res) => {
        activeWorkers--;
        if (isRunning) {
          batchRequests += res.totalRequests;
          batchErrors += res.errors;
          latencies.push(res.p50);
        }
      }).catch(err => {
        activeWorkers--;
        if (isRunning) {
          batchErrors++;
        }
      });
    }

    // Capture the 1-second metric frame
    totalRequests += batchRequests;
    totalErrors += batchErrors;

    const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : '0.00';

    // Sort latencies natively for percentiles in this 1s interval
    latencies.sort((a, b) => a - b);
    const p50 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.50)] : 0;
    const p95 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0;
    const p99 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] : 0;

    const metrics = {
      p50,
      p95,
      p99,
      throughput: batchRequests,
      errorRate,
      timeLeft: Math.max(0, endTime - Date.now()),
      activeUsers: targetUsers, // tell the frontend how many VUs are active
    };

    lastMetrics = metrics;

    // Use the user-configured custom thresholds for SLA checking
    const customThresholds = {
      p99: slaP99 || 1000,
      errorRate: maxErrorRate,
      throughput: minThroughput
    };

    // Only check throughput SLA if we actually processed requests this second
    if (batchRequests > 0 || batchErrors > 0) {
      checkSLA(metrics, customThresholds);
    } else {
      // Still check latency and error SLAs, but skip the throughput floor check
      const clonedMetrics = { ...metrics, throughput: 999 };
      checkSLA(clonedMetrics, customThresholds);
    }

    broadcast({ type: 'metrics', data: metrics });

    // Reset buckets for next second slice
    batchRequests = 0;
    batchErrors = 0;
    latencies = [];

  }, 1000);
}

module.exports = { runTest, getLastResult, getRunHistory };