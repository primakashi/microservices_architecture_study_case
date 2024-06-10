const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const { errorHandler } = require('./AuthUtils')
const { consumeRequestMessage } = require('./AuthQueues')
const port = process.env.PORT || 5000

// Connect DB
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Auth Service Database Connected`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
connectDB()

// Call the consumer function
consumeRequestMessage()
    .then(() => {
        console.log('Consuming messages from the checkIfUserExistsQueue')
    })
    .catch((err) => {
        console.log(`Cannot consume message. ${err.message}`)
    })

// Init app
const app = express()


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(errorHandler)

// Routes
app.use('/api/v1/auth/', require('./AuthRoutes'))


// Listen to the port
app.listen(port, () => {
    console.log(`Auth Service is running at http://localhost:${port}`)
})
