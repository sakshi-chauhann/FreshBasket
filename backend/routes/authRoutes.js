const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Get user's saved addresses
router.get('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new address
router.post('/add-address', protect, async (req, res) => {
  try {
    const { fullName, phone, address, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this is the first address or isDefault is true, set as default
    const shouldBeDefault = isDefault || user.addresses.length === 0;
    
    if (shouldBeDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses.push({
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault
    });
    
    await user.save();
    
    res.json({ 
      success: true, 
      addresses: user.addresses,
      message: 'Address saved successfully'
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update existing address
router.put('/update-address/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, address, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex]._doc,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    };
    
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete address
router.delete('/delete-address/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    // If the deleted address was default and there are other addresses, make the first one default
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;