const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image,
        quantity: quantity,
      });
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart,
      message: 'Item added to cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }
    
    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart,
      message: 'Cart updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }
    
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart,
      message: 'Item removed from cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Sync local cart with database (after login)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { localCart } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    
    // Merge local cart items with database cart
    for (const localItem of localCart) {
      const existingIndex = cart.items.findIndex(
        item => item.productId.toString() === localItem.id
      );
      
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += localItem.quantity;
      } else {
        cart.items.push({
          productId: localItem.id,
          name: localItem.name,
          price: localItem.price,
          weight: localItem.weight,
          image: localItem.image,
          quantity: localItem.quantity,
        });
      }
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart,
      message: 'Cart synced successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};