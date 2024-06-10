const amqp = require('amqplib')
const Product = require('./ProductModel')

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
  

const consumeProductMessage = async () => {
    try {
        const channel = await connectToRabbitMQ()
        const queue = 'productQueue'
        const responseQueue = 'productResponseQueue'

        await channel.assertQueue(queue, { durable: false })
        await channel.assertQueue(responseQueue, { durable: false })

        channel.consume(queue, async (message) => {
            if (message !== null) {
                const { product, quantity, description, owner, supplier } = JSON.parse(message.content.toString())
                console.log('data is here')
                console.log({
                    product,
                    quantity,
                    supplier, owner, description
                })
                const suppliedProduct = await Product.create({
                    name: product,
                    quantity,
                    description,
                    owner,
                    supplier,
                })
                
                if (suppliedProduct) {
                    data = {
                        msg: `Product has been successfully delivered`
                    }
                    console.log('data is here')
                    console.log(data)
                    channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(data)))
                } else {
                    data = {
                        msg: `There was an error while delivering the product`
                    }
                    console.log('data is here')
                    console.log(data)
                    channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(data)))

                }
            }
        })
    } catch (error) {
        
    }
}

module.exports = {
    consumeProductMessage
}