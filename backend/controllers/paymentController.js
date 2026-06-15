const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOrderConfirmation } = require('../config/email');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Payment and Create Order
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    console.log('Verify payment request body:', req.body);
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Create signature to verify
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.log('Signature verification failed');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    console.log('Signature verified successfully');

    // Create order in database
    const order = await Order.create({
      userId: req.user.id,
      items: orderData.items,
      subtotal: orderData.subtotal,
      platformFee: orderData.platformFee || 10,
      totalAmount: orderData.totalAmount,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: 'paid',
      orderStatus: 'processing',
      address: orderData.address,
    });

    console.log('Order created:', order._id);

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );

    // ========== SEND EMAIL CONFIRMATION ==========
    try {
      const user = await User.findById(req.user.id);
      
      if (user && user.email) {
        const emailResult = await sendOrderConfirmation(
          user.email,
          user.name || 'Customer',
          {
            orderId: order._id.toString().slice(-8),
            orderDate: order.createdAt,
            items: order.items,
            subtotal: order.subtotal,
            platformFee: order.platformFee,
            totalAmount: order.totalAmount,
            address: order.address,
          }
        );
        
        if (emailResult.success) {
          console.log('Order confirmation email sent');
          console.log('Email preview URL:', emailResult.previewUrl);
        } else {
          console.log('Failed to send email:', emailResult.error);
        }
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order if email fails
    }
    // ============================================

    res.status(200).json({
      success: true,
      orderId: order._id,
      message: 'Payment verified and order created',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};