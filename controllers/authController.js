const {promisify} = require('util')
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

 exports.protect = catchAsync( async (req,res,next) => {

// get token and check if it exist 
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
     token = req.headers.authorization.split(' ')[1]
}
if(!token) {
    return next(new AppError('you need to log in to get access', 401))
}
// verify token 
 const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)


// check if user exist 
const decodedUser = await User.findById(decoded.id)
if(!decodedUser) { return next(new AppError('User connected to this token no longer exist', 401))

}
// check if user changed pass after token was issued 
if (decodedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );  
  }
    
  //  ACCESS TO PROTECTED ROUTE
  req.user = decodedUser;
  next();
 })