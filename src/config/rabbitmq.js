const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async() => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();

        // Create a channel for sending emails
        await channel.assertQueue('email_queue', { durable: true });

        console.log('RabbitMQ connected and queue ready.');
    } catch (e) {
        console.error('RabbitMQ Connection Error:', e);
    }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };