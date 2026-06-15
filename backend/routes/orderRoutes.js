const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updatePaymentStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;