const express = require('express');
const path = require('path');
const fs = require('fs');
const anomalyModule = require('./anomaly');

const router = express.Router();

// Basic Authentication Middleware
function basicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Logs"');
    return res.status(401).send('Authentication required.');
  }
  // Example: username: admin, password: password (change in production!)
  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  if (user === 'admin' && pass === 'password') {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Logs"');
  return res.status(401).send('Invalid credentials.');
}

const PDFDocument = require('pdfkit');
// ... rest of code ...

// Download a combined report (anomaly + logs)
router.get('/download', basicAuth, (req, res) => {
  // ...existing JSON download code...
});

// Download a PDF report (anomaly + logs)
router.get('/download/pdf', basicAuth, (req, res) => {
  const alerts = anomalyModule.getAlerts ? anomalyModule.getAlerts() : [];
  const logPath = path.resolve(__dirname, '../../combined.log');
  const logs = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="anomaly_and_logs_report.pdf"');
  doc.pipe(res);

  doc.fontSize(18).text('Anomaly & Logs Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated at: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(14).text('Anomaly Alerts:', { underline: true });
  if (alerts.length === 0) {
    doc.text('No alerts found.');
  } else {
    alerts.forEach((alert, idx) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `${idx + 1}. ID: ${alert.id}, Severity: ${alert.severity}, Type: ${alert.type}, Source: ${alert.source}, Status: ${alert.status}, Time: ${alert.timestamp}`
      );
      if (alert.description) doc.text(`   Description: ${alert.description}`);
    });
  }
  doc.moveDown();

  doc.fontSize(14).text('Logs:', { underline: true });
  if (logs) {
    // Limit log output to avoid huge PDFs
    const logLines = logs.split('\n').slice(-200); // last 200 lines
    doc.fontSize(10).text(logLines.join('\n'));
  } else {
    doc.text('No logs found.');
  }

  doc.end();
});

module.exports = router;
