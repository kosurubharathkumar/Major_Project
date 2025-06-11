const express = require('express');
const router = express.Router();

// In-memory state
let totalAnomalies = 0;
let critical = 0;
let suspicious = 0;
let benign = 0;
let alerts = [];
let alertIdCounter = 1;

// Export state for dashboard
function getState() {
  return {
    totalAnomalies,
    alerts,
  };
}

function getAlerts() {
  return alerts;
}


module.exports = {
  router,
  getState,
  getAlerts,
};

router.get('/alerts', (req, res) => {
  res.json({ success: true, data: [...alerts] });
});

// POST /api/anomaly/alerts (for simulator to inject alerts)
router.post('/alerts', (req, res) => {
  const { severity, type, source, description, status, timestamp } = req.body;
  const alert = {
    id: alertIdCounter++,
    severity: severity || 'suspicious',
    type: type || 'brute-force',
    source: source || 'gateway',
    description: description || 'Simulated alert',
    status: status || 'active',
    timestamp: timestamp || new Date().toISOString(),
  };
  alerts.push(alert);
  totalAnomalies++;
  if (alert.severity === 'critical') critical++;
  if (alert.severity === 'suspicious') suspicious++;
  if (alert.severity === 'benign') benign++;
  if (alerts.length > 50) alerts.shift();
  console.log('[DEBUG] POST /api/anomaly/alerts new alert:', alert);
  console.log('[DEBUG] POST /api/anomaly/alerts state:', { totalAnomalies, critical, suspicious, benign, alertCount: alerts.length });
  res.json({ success: true, data: alert });
});

// GET /api/anomaly/stats
router.get('/stats', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const resolvedToday = alerts.filter(a => a.status === 'resolved' && a.timestamp.slice(0, 10) === today).length;
  const highSeverity = alerts.filter(a => a.severity === 'critical').length;
  const anomalyTypes = new Set(alerts.map(a => a.type)).size;
  const sourceDistribution = {};
  alerts.forEach(a => { sourceDistribution[a.source] = (sourceDistribution[a.source] || 0) + 1; });

  res.json({
    success: true,
    data: {
      totalAlerts,
      activeAlerts,
      resolvedToday,
      highSeverity,
      anomalyTypes,
      sourceDistribution
    }
  });
});

module.exports = {
  router,
  getState,
  getAlerts,
};
