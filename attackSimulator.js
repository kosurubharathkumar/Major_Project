const axios = require('axios');
const readline = require('readline');

const API_BASE_URL = 'http://localhost:5000';

const randomIP = () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomUsername = () => `user${Math.floor(Math.random() * 1000)}`;
const randomPassword = () => Math.random().toString(36).slice(-8);
const randomDelay = (min = 10, max = 500) => new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min + 1)) + min));
const randomBool = (prob = 0.2) => Math.random() < prob;

const attacks = [
  {
    name: 'Burst GET /api/gateway/requests',
    async run(count = 10) {
      for (let i = 0; i < count; i++) {
        await randomDelay();
        try {
          if (randomBool(0.1)) throw new Error('Simulated 500 Internal Server Error');
          const res = await axios.get(`${API_BASE_URL}/api/gateway/requests`);
          console.log(`[Burst ${i + 1}] Status: ${res.status}`);
        } catch (err) {
          console.error(`[Burst ${i + 1}] Error:`, err.message);
        }
      }
    }
  },
  {
    name: 'Brute Force Login (simulated)',
    async run(count = 20) {
      for (let i = 0; i < count; i++) {
        await randomDelay();
        try {
          const payload = {
            username: randomUsername(),
            password: randomPassword(),
            ip: randomIP(),
            success: !randomBool(0.8) // 80% fail, 20% success
          };
          if (!payload.success) throw new Error('Simulated 401 Unauthorized');
          await axios.post(`${API_BASE_URL}/api/gateway/requests`, payload);
          console.log(`[BruteForce ${i + 1}] Login ${payload.success ? 'SUCCESS' : 'FAIL'} for ${payload.username}`);
        } catch (err) {
          console.error(`[BruteForce ${i + 1}] Error:`, err.message);
        }
      }
    }
  },
  {
    name: 'DDoS Flood /api/gateway/requests',
    async run(count = 100) {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push((async () => {
          await randomDelay(1, 50);
          try {
            if (randomBool(0.15)) throw new Error('Simulated 429 Too Many Requests');
            await axios.get(`${API_BASE_URL}/api/gateway/requests`);
          } catch (err) {
            console.error(`[DDoS ${i + 1}] Error:`, err.message);
          }
        })());
      }
      await Promise.all(promises);
      console.log(`[DDoS] Sent ${count} requests.`);
    }
  },
  {
    name: 'Anomaly Alerts',
    async run(count = 10) {
      for (let i = 0; i < count; i++) {
        await randomDelay();
        try {
          if (randomBool(0.1)) throw new Error('Simulated Anomaly Detection Failure');
          const payload = {
            severity: randomBool(0.5) ? 'critical' : 'suspicious',
            type: randomBool(0.5) ? 'simulated-attack' : 'brute-force',
            source: 'simulator',
            description: 'Simulated anomaly alert',
            status: 'active',
            timestamp: new Date().toISOString(),
          };
          const res = await axios.post(`${API_BASE_URL}/api/anomaly/alerts`, payload);
          console.log(`[Anomaly ${i + 1}] POSTED alert, Status: ${res.status}`);
        } catch (err) {
          console.error(`[Anomaly ${i + 1}] Error:`, err.message);
        }
      }
    }
  },
  {
    name: 'Threat Indicator Injection',
    async run(count = 5) {
      for (let i = 0; i < count; i++) {
        await randomDelay();
        try {
          if (randomBool(0.2)) throw new Error('Simulated Threat Indicator Rejected');
          const payload = {
            indicator: 'malicious-ip',
            value: randomIP(),
            description: 'Simulated threat',
            severity: 'high'
          };
          const res = await axios.post(`${API_BASE_URL}/api/threat/indicators`, payload);
          console.log(`[Threat ${i + 1}] Status: ${res.status}`);
        } catch (err) {
          console.error(`[Threat ${i + 1}] Error:`, err.message);
        }
      }
    }
  },
  {
    name: 'Run All Attacks',
    async run() {
      for (const atk of attacks) {
        if (atk.name !== 'Run All Attacks') {
          console.log(`\n--- Running: ${atk.name} ---`);
          await atk.run();
        }
      }
    }
  }
];

async function main() {
  console.log('Attack Simulator');
  attacks.forEach((atk, i) => console.log(`${i + 1}. ${atk.name}`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Select attack type (1/2/3/4/5/6): ', async (answer) => {
    const idx = parseInt(answer, 10) - 1;
    if (attacks[idx]) {
      rl.question('How many times? (default: 10, ignored for "Run All Attacks"): ', async (count) => {
        const n = parseInt(count, 10) || 10;
        if (attacks[idx].name === 'Run All Attacks') {
          await attacks[idx].run();
        } else {
          await attacks[idx].run(n);
        }
        rl.close();
      });
    } else {
      console.log('Invalid selection.');
      rl.close();
    }
  });
}

if (require.main === module) {
  main();
}
