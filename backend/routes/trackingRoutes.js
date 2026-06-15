const express = require('express');
const {
  getOrderTracking,
  updateOrderStatus,
  getAllOrdersForAdmin,
} = require('../controllers/trackingController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone with order ID can track
router.get('/:orderId', getOrderTracking);

// Admin routes
router.use(protect, admin);
router.get('/admin/orders', getAllOrdersForAdmin);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;