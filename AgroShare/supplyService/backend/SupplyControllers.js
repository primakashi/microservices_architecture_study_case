const asyncHandler = require('express-async-handler');
const Supply = require('./SupplyModel');
const { connectToRabbitMQ, consumeSupplyQueue } = require('./SupplyQueues');


const createSupplyRequest = asyncHandler(async (req, res) => {
  try {
    const { product, quantity, supplier } = req.body;
  
    if (!product || !quantity || !supplier) {
      res.status(400);
      throw new Error('Please enter all fields');
    }

    const channel = await connectToRabbitMQ();
    const queue = 'checkIfUserExists';
    const response = 'responseQueue';
    

    // assert Channel
    await channel.assertQueue(queue, { durable: false });
    await channel.assertQueue(response, { durable: false });
    

    const message = {
      supplier
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    
    const data = await consumeSupplyQueue()
    
    if (data !== 'Incorrect User Code') {
      const supply = await Supply.create({
        requestFrom: req.user.id,
        requestTo: data,
        product,
        quantity,
        status: 'Pending'
      })
      res.status(201).json({
        message: 'A request has been sent',
        supply
      })
    }
    res.status(400)
    throw new Error('Incorrect User Code')
    
  } catch (error) {
    res.status(500);
    throw new Error(`${error.message}`);
  }
});


// @desc Edit A Supply Request
// @route PUT /api/v1/supply/:id
// @access Private
const updateSupplyRequestDetails = asyncHandler(async (req, res) => {
  try {
    const supplyRequest = await Supply.findOne({
      _id: req.params.id,
      requestFrom: req.user.id,
      status: 'Pending' // you cannot edit accepted or deleted requests
    })

    if (!supplyRequest) {
      res.status(404)
      throw new Error('No such request exists')
    }

    const { product, quantity } = req.body
    if (!product || !quantity) {
      res.status(400)
      throw new Error('Please enter all the fields')
    }

    supplyRequest.product = product
    supplyRequest.quantity = quantity
    await supplyRequest.save()

    res.status(200).json({
      message: 'You have edited the request successfully',
      supplyRequest
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// @desc Delete A Supply Request
// @route DELETE /api/v1/supply/:id
// @access Private
const deleteSupplyRequestDetails = asyncHandler(async (req, res) => {
  try {
    const supplyRequest = await Supply.findOne({
      _id: req.params.id,
      requestFrom: req.user.id,
      status: 'Pending' // you cannot deleted accepted or deleted requests
    })

    if (!supplyRequest) {
      res.status(404)
      throw new Error('No such request exists')
    }

    await supplyRequest.remove()

    res.status(200).json({
      message: 'You have deleted the request successfully',
      id: req.params.id
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

// @desc A supplier gets all the request he has received
// @route GET /api/v1/supply/received
// @access Private
const getSupplyRequestsReceived = asyncHandler(async (req, res) => {
  try {
    const supplyRequests = await Supply.find({
      requestTo: req.user.id
    })

    res.status(200).json({
      message: 'These are the supply requests you have received',
      supplyRequests
    })
  } catch(error) {
    res.status(500)
    throw new Error(error.message)
  }
})


// @access A user gets all the supply requests he has sent
// @route GET /api/v1/supply/sent
// @access Private
const getSupplyRequestsSent = asyncHandler(async (req, res) => {
  try {
    const supplyRequests = await Supply.find({
      requestFrom: req.user.id
    })

    res.status(200).json({
      message: 'These are the supply requests you have sent',
      supplyRequests
    })
  } catch(error) {
    res.status(500)
    throw new Error(error.message)
  }
})


// @access A supplier Accepts/Rejects a request
// @route PUT /api/v1/supply/status/:id
// @access Private
const acceptOrDeclineRequest = asyncHandler(async (req, res) => {
  try {
    const supplyRequest = await Supply.findOne({
      _id: req.params.id,
      requestTo: req.user.id
    })

    if (!supplyRequest) {
      res.status(404)
      throw new Error('No such request exists')
    }

    const { status } = req.query
    if (!status ) {
      res.status(400)
      throw new Error('Please enter the status of the request')
    }

    if (status === 'Pending' || status === 'Declined') {
      supplyRequest.status = status
      await supplyRequest.save()
      return res.status(200).json({
        message: `Request has a status of ${status}`
      })
    }
    
    // if the request has been acceoted, send the product
    supplyRequest.status = status
    await supplyRequest.save()
    
      
    const channel = await connectToRabbitMQ();
    const queue = 'productQueue';
    const responseQueue = 'productResponseQueue'
    
    const { description } = req.body
    // assert Channel
    await channel.assertQueue(queue, { durable: false });
    await channel.assertQueue(responseQueue, { durable: false });
    
    const product = {
      product: supplyRequest.product,
      quantity: supplyRequest.quantity,
      description,
      owner: supplyRequest.requestFrom,
      supplier: supplyRequest.requestTo
    }
  
    // send product detail as message to the queue
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(product)));

  // consume the response and then display the message
  channel.consume(responseQueue, async (message) => {
    if (message !== null) {
      const { data } = JSON.parse(message.content.toString())
      res.status(200).json({
        data
      })
    }
  })
    
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})


module.exports = {
  createSupplyRequest,
  getSupplyRequestsReceived,
  getSupplyRequestsSent,
  acceptOrDeclineRequest,
  updateSupplyRequestDetails,
  deleteSupplyRequestDetails
};
