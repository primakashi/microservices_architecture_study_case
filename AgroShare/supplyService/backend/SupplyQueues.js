const amqp = require('amqplib')
const Supply = require('./SupplyModel')
// connects to RabbitMQ
const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};


const consumeSupplyQueue = async () => {
  try {
    const channel = await connectToRabbitMQ();
    const response = 'responseQueue';

    // Assert Channel
    await channel.assertQueue(response, { durable: false });

    return new Promise((resolve, reject) => {
      const consumer = async (message) => {
        if (message !== null) {
          const { data } = JSON.parse(message.content.toString());
          resolve(data);
          channel.ack(message);
        }
      };

      channel.consume(response, consumer, { noAck: false });
    });
  } catch (error) {
    return error;
  }
};


module.exports = {
  connectToRabbitMQ,
  consumeSupplyQueue
}