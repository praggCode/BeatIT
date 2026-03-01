const express = require('express');
const router = express.Router();
const { getLastResult, getRunHistory } = require('../services/testRunner');
const { compareRuns } = require('../services/diff');

/**
 * GET /api/results/latest
 * Returns the most recent completed test result.
 */
router.get('/results/latest', (req, res) => {
    const result = getLastResult();
    if (!result) return res.status(404).json({ error: 'No test has been run yet' });
    res.json({ status: 'ok', result });
});

/**
 * GET /api/results/history
 * Returns the last 2 auto-saved runs.
 */
router.get('/results/history', (req, res) => {
    res.json({ status: 'ok', runs: getRunHistory() });
});

/**
 * POST /api/results/diff
 * Diffs the last two auto-saved runs.
 * Optionally accepts { before, after } in the body to override.
 */
router.post('/results/diff', (req, res) => {
    try {
        let before = req.body?.before;
        let after = req.body?.after;

        if (!before || !after) {
            const history = getRunHistory();
            if (history.length < 2) {
                return res.status(400).json({
                    error: `Only ${history.length} run(s) recorded. Run at least two tests to compare.`
                });
            }
            [before, after] = history;
        }

        const result = compareRuns(before, after);
        res.json({ status: 'ok', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
