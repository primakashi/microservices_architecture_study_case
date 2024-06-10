const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./AuthModels')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter all fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        uniqueCode: await getUniqueCode()
    })

    const { password: _, ...newUser } = user._doc
    
    res.status(201).json({
        message: `Account has been created for ${name}`,
        token: generateToken(newUser._id),
        newUser
    })
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body 

        if(!email || !password){
            res.status(400)
            throw new Error('Please enter fields')
        }

        const user = await User.findOne({ email })

        if (user && await bcrypt.compare(password, user.password)){
            res.status(200)
            res.json({
                message: 'Successful Login',
                token: generateToken(user._id)
            })
        }else {
            res.status(400)
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}



const generateAlphanumericString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let alphanumericString = '';
  
    for (let i = 0; i < 6; i++) {
      alphanumericString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return alphanumericString;
  }
  
  const getUniqueCode = async () => {
    let uniqueCode = generateAlphanumericString();
  
    const codeExists = await User.findOne({ uniqueCode });
  
    if (codeExists) {
      return getUniqueCode(); // Recursive call to generate a new unique code
    }
  
    return uniqueCode;
  }
  
module.exports = {
    registerUser,
    loginUser
  }