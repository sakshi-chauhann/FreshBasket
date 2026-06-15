const mongoose = require('mongoose');

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
});

// Tracking History Schema
const TrackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    required: true,
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: 'system',
  },
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  platformFee: {
    type: Number,
    default: 10,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingHistory: [TrackingHistorySchema],
  estimatedDelivery: {
    type: Date,
  },
  razorpayOrderId: {
    type: String,
  },
  address: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add tracking history when order status changes
OrderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    const statusMessages = {
      'pending': 'Order placed successfully',
      'confirmed': 'Order confirmed by restaurant',
      'processing': 'Your order is being prepared',
      'shipped': 'Order has been shipped',
      'out_for_delivery': 'Order is out for delivery',
      'delivered': 'Order delivered successfully',
      'cancelled': 'Order has been cancelled',
    };
    
    this.trackingHistory.push({
      status: this.orderStatus,
      message: statusMessages[this.orderStatus] || `Order status updated to ${this.orderStatus}`,
      timestamp: new Date(),
      updatedBy: 'system',
    });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);