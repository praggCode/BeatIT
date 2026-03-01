const express = require('express');
const router = express.Router();
const { runTest } = require('../services/testRunner');

router.post('/test/start', async (req, res) => {
  const {
    target,
    users = 10,
    duration = 30000,
    strategy = 'spike',
    slaP99 = 500,
    minThroughput = 10,
    maxErrorRate = 5
  } = req.body;

  if (!target) {
    return res.status(400).json({ error: 'target URL is required' });
  }

  // respond immediately — test runs in background, results stream via WebSocket
  res.json({ status: 'started', target, users, duration, strategy, slaP99, minThroughput, maxErrorRate });

  // run test without awaiting so the HTTP response returns right away
  runTest({ target, users, duration, strategy, slaP99, minThroughput, maxErrorRate }).catch(console.error);
});

module.exports = router;