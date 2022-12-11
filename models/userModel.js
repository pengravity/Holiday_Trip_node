const mongoose = require('mongoose');
const validator = require('validator');


// name, email, photo, password, passwordConfirm 

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [
          30,
          'user name need to have less or equal than 30 characters ',
        ],
        minLength: [
          6,
          'user name need to have more or equal than 6 characters ',
        ],
      },

      email: {
        type: String,
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      photo: {
        type: String
      }, 
      password: {
        type: String, 
        required: [true, 'Password is required'],
        minLength: [
            8, 'password need to have at least 8 characters'
        ]
      },
      passwordConfirmation: {
      type: String,
      required: [true, 'Password confirmation is required'],
      minLength: [
        8, 'password need to have at least 8 characters'
    ]
      }});
    
      const User = mongoose.model('User', userSchema);

      module.exports = User;