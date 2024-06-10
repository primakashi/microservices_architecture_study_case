const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const { errorHandler } = require('./SupplyUtils')
const { consumeSupplyQueue } = require('./SupplyQueues')
const port = process.env.PORT || 5002

// Connect DB
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Supply Service Database Connected`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
connectDB()





const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(errorHandler)

// Routes
app.use('/api/v1/supply/', require('./SupplyRoutes'))


// Listen to the port
app.listen(port, () => {
    console.log(`Supply Service is running at http://localhost:${port}`)
})