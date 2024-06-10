const productRouter = require('express').Router()

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('./ProductControllers')

const { protect } = require('./ProductUtils')

productRouter.route('/')
    .post(protect, createProduct)
    productRouter.route('/').get(protect, getProducts)

productRouter.route('/:id')
    .get(protect, getProduct)
    productRouter.route('/:id').put(protect, updateProduct)
    productRouter.route('/:id').delete(protect, deleteProduct)


module.exports = productRouter