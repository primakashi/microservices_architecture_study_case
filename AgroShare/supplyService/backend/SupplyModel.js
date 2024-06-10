const mongoose = require('mongoose')

const SupplySchema = new mongoose.Schema({
    requestFrom: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    requestTo: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enums: ['Pending', 'Accepted', 'Rejected'],
    }
},
    {
    timestamps: true
    })


module.exports = mongoose.model('Supply', SupplySchema)