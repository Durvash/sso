const app = require('./app');
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`🚀 SSO Backend is running on port ${PORT}`);
});

// Handle graceful shutdown for Docker
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});