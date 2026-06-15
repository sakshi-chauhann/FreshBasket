const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlist);

module.exports = router;