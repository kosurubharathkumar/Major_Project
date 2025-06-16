const express = require('express');
const cors = require('cors');

const dashboardRoutes = require('./src/routes/dashboard');
const monitoringRoutes = require('./src/routes/monitoring');
const anomalyModule = require('./src/routes/anomaly');
const logsRoutes = require('./src/routes/logs');
const threatRoutes = require('./src/routes/threat');
const gatewayRoutes = require('./src/routes/gateway');
const responseRoutes = require('./src/routes/response');
const siemRoutes = require('./src/routes/siem');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/anomaly', anomalyModule.router);
app.use('/api/threat', threatRoutes);
app.use('/api/gateway', gatewayRoutes);
app.use('/api/response', responseRoutes);
app.use('/api/siem', siemRoutes);
app.use('/api/logs', logsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});