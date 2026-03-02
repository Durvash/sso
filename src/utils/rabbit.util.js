const amqp = require('amqplib');
require('dotenv').config();

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchange = 'central_notifications_exchange';
  }

  async initialize() {
    if (this.channel) return; // Prevent multiple connection attempts
    try {
      const url = process.env.RABBITMQ_URL;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      console.log('✅ RabbitMQ initialized and Exchange asserted');
    } catch (error) {
      console.error('❌ RabbitMQ Connection Error:', error.message);
      this.channel = null; // Ensure it stays null so we can retry later
    }
  }

  async publishNotification(routingKey, payload) {
    // 1. If channel is missing, try to initialize on the fly
    if (!this.channel) {
      await this.initialize();
    }

    // 2. SAFETY CHECK: If it's STILL null, log error instead of crashing
    if (!this.channel) {
      console.error(`🚫 Failed to publish to ${routingKey}: No RabbitMQ Connection`);
      return; 
    }

    try {
      const data = JSON.stringify({
        metadata: { service: 'SSO-SERVICE', timestamp: new Date() },
        ...payload
      });

      this.channel.publish(this.exchange, routingKey, Buffer.from(data), {
        persistent: true
      });
      console.log(`📤 Message sent to exchange: ${routingKey}`);
    } catch (err) {
      console.error('❌ Publish failed:', err.message);
    }
  }
}

module.exports = new RabbitMQClient();