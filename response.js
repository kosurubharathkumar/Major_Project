const express = require('express');
const router = express.Router();

// GET /api/response/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalResponses: 15,
      automated: 10,
      manual: 5
    }
  });
});

// GET /api/response/rules
router.get('/rules', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Block IP', enabled: true }
    ]
  });
});

// GET /api/response/actions
router.get('/actions', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, action: 'Blocked IP', time: new Date().toISOString() }
    ]
  });
});

// PUT /api/response/rules/:ruleId
router.put('/rules/:ruleId', (req, res) => {
  res.json({
    success: true,
    data: null
  });
});

module.exports = router;
