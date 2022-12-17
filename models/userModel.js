const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxLength: [30, 'user name need to have less or equal than 30 characters '],
    minLength: [6, 'user name need to have more or equal than 6 characters '],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'password need to have at least 8 characters'],
    // never show
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Password confirmation is required'],
    minLength: [8, 'password need to have at least 8 characters'],
    validate: {
      // work only on SAVE or CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // only run this if password was modified
  if (!this.isModified('password')) return next();

  // encrypt the password
  this.password = await bcrypt.hash(this.password, 12);

  // dont save the passwordConfirmation to DB
  this.passwordConfirmation = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // helping to ensure token is created after password have been changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method, return true/false
userSchema.methods.correctPassword = async function (
  passwordToCheck,
  userPassword
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

// passwordChangedAt exist if user have changed his password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // if no changes to the password
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // using crypto as be dont need strong encryption like bcrypt
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log(resetToken, this.passwordResetToken);

  // time in milisec
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
