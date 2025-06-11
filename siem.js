const express = require('express');
const router = express.Router();

// GET /api/siem/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalEvents: 50,
      integrations: 3
    }
  });
});

// GET /api/siem/events
router.get('/events', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, type: 'login', status: 'success', time: new Date().toISOString() }
    ]
  });
});

// GET /api/siem/integrations
router.get('/integrations', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'SIEM-X', status: 'active' }
    ]
  });
});

// PUT /api/siem/integrations/:integrationId
router.put('/integrations/:integrationId', (req, res) => {
  res.json({
    success: true,
    data: null
  });
});

module.exports = router;
