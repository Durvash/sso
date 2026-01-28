const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');

// check health
router.use('/health', healthRoutes);

// all routes
// router.use('/auth', authRoutes);

module.exports = router;