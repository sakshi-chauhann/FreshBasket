const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,  // Changed to Mixed
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  weight: String,
  image: String,
  variant: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', CartSchema);