const Order = require('../models/Order');
const { sendStatusUpdateEmail } = require('../config/email');

// @desc    Get order tracking details
// @route   GET /api/tracking/:orderId
// @access  Public (with order ID)
const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    // Calculate estimated delivery (3 days from order date if not set)
    let estimatedDelivery = order.estimatedDelivery;
    if (!estimatedDelivery && order.createdAt) {
      estimatedDelivery = new Date(order.createdAt);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    }
    
    // Get status timeline
    const timeline = order.trackingHistory || [];
    
    // Get current status details
    const currentStatus = order.orderStatus;
    const statusInfo = {
      'pending': { progress: 0, color: 'gray', icon: '📦' },
      'confirmed': { progress: 20, color: 'blue', icon: '✅' },
      'processing': { progress: 40, color: 'orange', icon: '🍳' },
      'shipped': { progress: 60, color: 'purple', icon: '🚚' },
      'out_for_delivery': { progress: 80, color: 'yellow', icon: '🛵' },
      'delivered': { progress: 100, color: 'green', icon: '🎉' },
      'cancelled': { progress: 0, color: 'red', icon: '❌' },
    };
    
    res.status(200).json({
      success: true,
      tracking: {
        orderId: order._id,
        status: currentStatus,
        statusInfo: statusInfo[currentStatus],
        estimatedDelivery,
        timeline,
        items: order.items,
        address: order.address,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/tracking/:orderId/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    
    // Add custom message to tracking history
    if (message) {
      order.trackingHistory.push({
        status,
        message,
        timestamp: new Date(),
        updatedBy: req.user.id,
      });
    }
    
    await order.save();
    
    // Send email notification for status update
    try {
      const user = await require('../models/User').findById(order.userId);
      if (user && user.email) {
        await sendStatusUpdateEmail(user.email, user.name, {
          orderId: order._id.toString().slice(-8),
          status,
          message: message || getStatusMessage(status),
          oldStatus,
        });
      }
    } catch (emailError) {
      console.error('Status update email error:', emailError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders for admin (with status filter)
// @route   GET /api/tracking/admin/orders
// @access  Private/Admin
const getAllOrdersForAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

function getStatusMessage(status) {
  const messages = {
    'confirmed': 'Your order has been confirmed!',
    'processing': 'Your order is being prepared in the kitchen.',
    'shipped': 'Your order has been shipped!',
    'out_for_delivery': 'Your order is out for delivery!',
    'delivered': 'Your order has been delivered. Enjoy your meal!',
    'cancelled': 'Your order has been cancelled.',
  };
  return messages[status] || `Your order status updated to ${status}`;
}

module.exports = {
  getOrderTracking,
  updateOrderStatus,
  getAllOrdersForAdmin,
};