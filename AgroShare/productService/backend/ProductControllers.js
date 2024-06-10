const asyncHandler = require('express-async-handler')
const Product = require('./ProductModel')

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, quantity } = req.body

    if (!name || !description || !quantity) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    const product = await Product.findOne({
        owner: req.user.id,
        name
    })

    if (product) {
        res.status(400)
        throw new Error(`Such product already exists and it has a quantity of ${product.quantity}`)
    }

    const newProduct = await Product.create({
        name,
        description,
        quantity,
        owner: req.user.id,
        supplier: req.user.id
    })

    res.status(201).json({
        message: 'Product has been created successfully',
        newProduct
    })
})
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        owner: req.user.id
    })
    res.status(200).json({
        message: 'Products have been received successfully',
        products
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Such product does not exist')
    }
    res.status(200).json({
        message: 'A Product has been received successfully',
        product
    })
})
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Such product does not exist')
    }

    const { name, description, quantity } = req.body

    if (!name || !description || !quantity) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    product.name = name
    product.description = description
    product.quantity = quantity

    await product.save()
    res.status(200).json({
        message: 'A Product has been updated successfully',
        product
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Such product does not exist')
    }
    res.status(200).json({
        message: 'A Product has been deleted successfully',
        id: product._id
    })
})


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}