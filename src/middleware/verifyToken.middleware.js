const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized!',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check Redis for the session
    const sessionData = await redisClient.get(`session:${decoded.id}`);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or logged out. Please login again.',
      });
    }

    // Update req.user with session data
    req.user = JSON.parse(sessionData);

    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token is invalid',
    });
  }
};

module.exports = { verifyToken };
