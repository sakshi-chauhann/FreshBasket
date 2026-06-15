const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/sync', syncCart);

module.exports = router;