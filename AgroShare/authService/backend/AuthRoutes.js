const authRouter = require('express').Router()

const { registerUser, loginUser } = require('./AuthControllers')

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)

module.exports = authRouter