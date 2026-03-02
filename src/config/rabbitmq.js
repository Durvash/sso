const amqp = require('amqplib');
require('dotenv').config();

const connectRabbitMQ = async () => {
  try {
    await amqp.connect(process.env.RABBITMQ_URL);
    console.log('✅ Connected to RabbitMQ');
  } catch (e) {
    console.error('❌ RabbitMQ Connection Error:', e);
  }
};

(async () => {
  connectRabbitMQ();
})();

module.exports = { connectRabbitMQ };
