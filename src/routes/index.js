const express = require('express');
const router = express.Router();

// Import module routes
const healthRoutes = require('./health');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');

// check health
router.use('/health', healthRoutes);

// all routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;