const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name, 
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
    })

    const token = signToken( newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

 exports.login = catchAsync( async (req, res, next) => {
    const {email, password}  = req.body

    // check if email and pass exist 
   if(!email || !password) {
   return  next(new AppError('Please provide email and password', 400))
   }
    // check if user exist && pass is correct 
    const user =await User.findOne({ email}).select('+password')
   

   if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401))
   }

    // if all ok, send token to client 
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
 })