const supplyRouter = require('express').Router()

const { protect } = require('./SupplyUtils')

const {
    createSupplyRequest,
    getSupplyRequestsReceived,
    getSupplyRequestsSent,
    acceptOrDeclineRequest,
    updateSupplyRequestDetails,
    deleteSupplyRequestDetails
} = require('./SupplyControllers')

supplyRouter.post('/create', protect, createSupplyRequest)
supplyRouter.get('/received', protect, getSupplyRequestsReceived)
supplyRouter.get('/sent', protect, getSupplyRequestsSent)
supplyRouter.put('/status/:id', protect, acceptOrDeclineRequest)
supplyRouter.route('/:id')
            .put(protect, updateSupplyRequestDetails)
            .delete(protect, deleteSupplyRequestDetails)

module.exports = supplyRouter