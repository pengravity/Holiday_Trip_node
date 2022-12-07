const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
  rating: Number,
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
