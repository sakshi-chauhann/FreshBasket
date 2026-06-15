const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes - REMOVED paymentRoutes for now
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/recipe', require('./routes/recipeRoutes'));
// app.use('/api/payment', require('./routes/paymentRoutes')); // Comment this out for now
app.use('/api/auth', require('./routes/googleAuthRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'FreshBasket API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});