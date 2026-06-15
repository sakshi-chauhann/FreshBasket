const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  name: String,  // e.g., "500g", "1kg", "Penne", "Spaghetti"
  price: Number,
  weight: String,
  inStock: {
    type: Boolean,
    default: true,
  },
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  image: String,
  variants: [VariantSchema],  // Multiple options!
  defaultVariant: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);