const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, subtotal, platformFee, totalAmount, address } = req.body;
    
    // Process items - handle both real products and AI-generated items
    const processedItems = [];
    
    for (let item of items) {
      // Check if this is a valid MongoDB ObjectId (24 hex characters)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);
      
      if (isValidObjectId) {
        // Real product - verify it exists in database
        const product = await Product.findById(item.productId);
        if (product) {
          // Real product found in database
          processedItems.push({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            isAiGenerated: false
          });
        } else {
          // Looks like ObjectId but product not found - treat as AI item
          processedItems.push({
            productId: null,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            isAiGenerated: true
          });
        }
      } else {
        // AI-generated item (not in database) - this includes items from Recipe feature
        processedItems.push({
          productId: null,
          name: item.name,
          quantity: item.quantity,
          price: item.price || 50,
          isAiGenerated: true
        });
      }
    }
    
    const order = await Order.create({
      userId: req.user.id,
      items: processedItems,
      subtotal,
      platformFee: platformFee || 10,
      totalAmount,
      address,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });
    
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    // Check if order belongs to user or user is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    order.paymentId = paymentId;
    order.paymentStatus = paymentStatus;
    
    await order.save();
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updatePaymentStatus,
};