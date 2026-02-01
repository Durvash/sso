const express = require('express');
const router = express.Router();

// Import module routes
const healthRoutes = require('./health');
const authRoutes = require('../modules/auth/auth.routes');

// check health
router.use('/health', healthRoutes);

// all routes
router.use('/auth', authRoutes)

module.exports = router;