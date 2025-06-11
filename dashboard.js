const express = require('express');
const router = express.Router();

// Import state getter functions from gateway and anomaly modules
const gatewayGetState = require('./gateway').getState;
const anomalyGetState = require('./anomaly').getState;

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  const gatewayState = gatewayGetState();
  const anomalyStats = anomalyGetState();
  // Pull anomaly stats using the same logic as /api/anomaly/stats
  const alerts = anomalyStats.alerts || [];
  const today = new Date().toISOString().slice(0, 10);
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const resolvedToday = alerts.filter(a => a.status === 'resolved' && a.timestamp.slice(0, 10) === today).length;
  const highSeverity = alerts.filter(a => a.severity === 'critical').length;
  const anomalyTypes = new Set(alerts.map(a => a.type)).size;
  const sourceDistribution = {};
  alerts.forEach(a => { sourceDistribution[a.source] = (sourceDistribution[a.source] || 0) + 1; });

  const totalRequests = gatewayState.totalRequests || 0;
  const avgLatency = totalRequests ? (gatewayState.totalLatency / totalRequests).toFixed(2) : 0;
  const errorRate = totalRequests ? (gatewayState.errorCount / totalRequests * 100).toFixed(2) : 0;
  const successRate = totalRequests ? (gatewayState.successCount / totalRequests * 100).toFixed(2) : 0;

  res.json({
    success: true,
    data: {
      totalRequests,
      avgLatency: parseFloat(avgLatency),
      errorRate: parseFloat(errorRate),
      successRate: parseFloat(successRate),
      totalAlerts,
      activeAlerts,
      resolvedToday,
      highSeverity,
      anomalyTypes,
      sourceDistribution,
      uptime: 99.98,
      lastUpdated: new Date().toISOString()
    }
  });
});

module.exports = router;
