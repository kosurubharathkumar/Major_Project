const express = require('express');
const router = express.Router();

// GET /api/monitoring/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      cpuUsage: 18.7,
      memoryUsage: 62.3,
      diskUsage: 48.5,
      networkTraffic: 123456,
      lastChecked: new Date().toISOString()
    }
  });
});

module.exports = router;
