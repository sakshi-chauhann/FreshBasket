const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route - No token' 
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route - Invalid token' 
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Not authorized as admin' 
    });
  }
};

module.exports = { protect, admin };