const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, items: [] });
    }
    
    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, items: [] });
    }
    
    // Check if product already in wishlist
    const alreadyExists = wishlist.items.some(item => item.productId.toString() === productId);
    
    if (alreadyExists) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    
    wishlist.items.push({ productId });
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }
    
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    const isInWishlist = wishlist ? wishlist.items.some(item => item.productId.toString() === productId) : false;
    
    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};