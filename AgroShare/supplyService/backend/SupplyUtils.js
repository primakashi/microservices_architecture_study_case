const jwt = require('jsonwebtoken')
require('dotenv').config()
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token
            token = req.headers.authorization.split(' ')[1]
            
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // GET user from the token
            req.user = decoded
            next()
        } catch(err) {
            console.log(err)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized. No token')
    }
})

const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    res.json({
        error: true,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })

    next()
}

module.exports = {
    errorHandler,
    protect
}