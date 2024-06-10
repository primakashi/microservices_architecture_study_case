const amqp = require('amqplib')
const User = require('./AuthModels')


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

const consumeRequestMessage = async () => {
    try {
      const channel = await connectToRabbitMQ();
      const queue = 'checkIfUserExists';
      const response = 'responseQueue'

      // create the queues
      await channel.assertQueue(queue, { durable: false });
      await channel.assertQueue(response, { durable: false })

  
      // Consume the request message from the queue
      channel.consume(queue, async (message) => {
        if (message !== null) {
          const { supplier } = JSON.parse(message.content.toString());

          const userDetails = await User.findOne({ uniqueCode: supplier })
          
          let responseMessage
          // Prepare the response message
          if (userDetails) {
            responseMessage = {
              data: userDetails._id
            }
          } else {
            responseMessage = {
              data: 'Incorrect User Code'
            }
          }   
          console.log(responseMessage)
          // Publish the response message to a response queue
          channel.sendToQueue(response, Buffer.from(JSON.stringify(responseMessage)));
  
          // Acknowledge the message to remove it from the queue
          channel.ack(message);
        }
      });
    } catch (error) {
      console.error('Error consuming request message:', error);
      throw error;
    }
  };


  
  
module.exports = {
  consumeRequestMessage
}