const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const redisClient = require('../config/redis');

router.get('/', async (req, res) => {
  const healthcheck = {
    status: 'UP',
    uptime: process.uptime(),
    timestamp: Date.now(),
    checks: {
      database: 'DOWN',
      redis: 'DOWN'
    }
  };

  try {
    // 1. Check PostgreSQL (Simple "SELECT 1" query)
    await pool.query('SELECT 1');
    healthcheck.checks.database = 'UP';

    // 2. Check Redis (Check if client is ready)
    if (redisClient.isReady) {
      healthcheck.checks.redis = 'UP';
    }

    // If both are UP, send 200, otherwise send 503 (Service Unavailable)
    const isHealthy = healthcheck.checks.database === 'UP' && healthcheck.checks.redis === 'UP';
    res.status(isHealthy ? 200 : 503).json(healthcheck);

  } catch (error) {
    healthcheck.status = 'DEGRADED';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;