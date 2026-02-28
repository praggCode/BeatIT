const { Pool } = require('undici');
const { build } = require('hdr-histogram-js');

module.exports = async ({ target, requests }) => {
  const url = new URL(target);
  const pool = new Pool(url.origin);
  const histogram = build({ lowestDiscernibleValue: 1, highestTrackableValue: 30000 });

  let errors = 0;

  for (let i = 0; i < requests; i++) {
    const start = Date.now();
    try {
      const res = await pool.request({ method: 'GET', path: url.pathname || '/' });
      await res.body.text(); // drain the response body or it hangs
      histogram.recordValue(Date.now() - start);
    } catch (err) {
      errors++;
      console.error(`Request ${i + 1} failed:`, err.message);
    }
  }

  await pool.close();

  return {
    p50: histogram.getValueAtPercentile(50),
    p95: histogram.getValueAtPercentile(95),
    p99: histogram.getValueAtPercentile(99),
    totalRequests: requests,
    errors,
  };
};