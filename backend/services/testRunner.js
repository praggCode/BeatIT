const Piscina = require('piscina');
const path = require('path');
const { broadcast } = require('../ws/socket');

const pool = new Piscina({
  filename: path.resolve(__dirname, '../workers/loadWorker.js'),
  maxThreads: 4,
});

async function runTest({ target, users, duration }) {
  broadcast({ type: 'status', data: { state: 'running' } });

  const endTime = Date.now() + duration;
  let totalRequests = 0;
  let totalErrors = 0;

  while (Date.now() < endTime) {
    const batchStart = Date.now();

    const results = await Promise.all(
      Array.from({ length: users }, () =>
        pool.run({ target, requests: 3 })  // ← lowered from 10 to 3
      )
    );

    const batchTime = (Date.now() - batchStart) / 1000; // seconds this batch took

    const batchRequests = results.reduce((a, b) => a + b.totalRequests, 0);
    const batchErrors   = results.reduce((a, b) => a + b.errors, 0);

    totalRequests += batchRequests;
    totalErrors   += batchErrors;

    broadcast({
      type: 'metrics',
      data: {
        p50:        avg(results.map(r => r.p50)),
        p95:        avg(results.map(r => r.p95)),
        p99:        avg(results.map(r => r.p99)),
        throughput: Math.round(batchRequests / batchTime), // req/s for THIS batch
        errorRate:  totalRequests > 0
                      ? ((totalErrors / totalRequests) * 100).toFixed(2)
                      : '0.00',
        timeLeft:   Math.max(0, endTime - Date.now()), // ms remaining
      }
    });
  }

  broadcast({ type: 'status', data: { state: 'completed' } });
}

function avg(arr) {
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

module.exports = { runTest };