const express = require('express');
const router = express.Router();

// GET /api/threat/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalThreats: 7,
      high: 2,
      medium: 3,
      low: 2
    }
  });
});

// GET /api/threat/search
router.get('/search', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, indicator: 'malicious-ip', value: '192.168.1.100' }
    ]
  });
});

// GET /api/threat/feeds
router.get('/feeds', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Feed A', lastUpdated: new Date().toISOString() }
    ]
  });
});

// GET /api/threat/correlations
router.get('/correlations', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, sources: ['Feed A', 'Feed B'], result: 'correlated' }
    ]
  });
});

// POST /api/threat/indicators
router.post('/indicators', (req, res) => {
  res.json({
    success: true,
    data: { id: 2, ...req.body }
  });
});

module.exports = router;
