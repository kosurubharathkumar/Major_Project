const express = require('express');
const router = express.Router();

// In-memory state
let totalRequests = 0;
let requests = [];
let errorCount = 0;
let successCount = 0;
let totalLatency = 0;

// Export state for dashboard
function getState() {
  return {
    totalRequests,
    errorCount,
    successCount,
    totalLatency,
    requests,
  };
}

function randomStatus() {
  // 80% 200, 10% 401, 5% 500, 5% 429
  const r = Math.random();
  if (r < 0.8) return 200;
  if (r < 0.9) return 401;
  if (r < 0.95) return 500;
  return 429;
}
function randomMethod() {
  return ['GET','POST','PUT','DELETE'][Math.floor(Math.random()*4)];
}
function randomEndpoint() {
  return ['/api/test','/api/login','/api/data','/api/user','/api/submit'][Math.floor(Math.random()*5)];
}
function randomIP() {
  return `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}
function randomLatency() {
  return Math.floor(Math.random()*500)+10;
}

// GET /api/gateway/requests
router.get('/requests', (req, res) => {
  totalRequests++;
  const status = randomStatus();
  const method = randomMethod();
  const endpoint = randomEndpoint();
  const ip = randomIP();
  const responseTime = randomLatency();
  const success = status === 200;
  if (success) successCount++; else errorCount++;
  totalLatency += responseTime;
  const reqObj = {
    id: totalRequests,
    endpoint,
    method,
    status,
    ip,
    responseTime,
    timestamp: new Date().toISOString(),
    success
  };
  requests.push(reqObj);
  if (requests.length > 100) requests.shift();
  res.json({ success: true, data: [...requests] });
});

// POST /api/gateway/requests (for brute force, DDoS, etc)
router.post('/requests', (req, res) => {
  totalRequests++;
  const { endpoint, method, status, ip, responseTime, timestamp, success, username, password } = req.body;
  // Use provided or random values
  const reqObj = {
    id: totalRequests,
    endpoint: endpoint || randomEndpoint(),
    method: method || randomMethod(),
    status: status || randomStatus(),
    ip: ip || randomIP(),
    responseTime: responseTime || randomLatency(),
    timestamp: timestamp || new Date().toISOString(),
    success: typeof success === 'boolean' ? success : (status === 200),
    username,
    password
  };
  if (reqObj.success) successCount++; else errorCount++;
  totalLatency += reqObj.responseTime;
  requests.push(reqObj);
  if (requests.length > 100) requests.shift();
  res.json({ success: true, data: reqObj });
});

// GET /api/gateway/stats
router.get('/stats', (req, res) => {
  const avgLatency = totalRequests ? (totalLatency/totalRequests).toFixed(2) : 0;
  const errorRate = totalRequests ? (errorCount/totalRequests*100).toFixed(2) : 0;
  const successRate = totalRequests ? (successCount/totalRequests*100).toFixed(2) : 0;
  res.json({
    success: true,
    data: {
      totalRequests,
      errorRate: parseFloat(errorRate),
      successRate: parseFloat(successRate),
      avgLatency: parseFloat(avgLatency)
    }
  });
});

module.exports = router;
module.exports.getState = getState;
