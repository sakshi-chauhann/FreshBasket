const Product = require('../models/Product');

  // @desc    Get all products
  const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

    // @desc    Get single product
  const getProductById = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
     if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  // @desc    Create new product (Admin only)
  const createProduct = async (req, res) => {
  try {
    const { name, description, price, weight, category, image, inStock } = req.body;
    
    const product = await Product.create({
      name,
      description: description || '',
      price: Number(price) || 0,
      weight: weight || '',
      category,
      image: image || '',
      inStock: inStock === true || inStock === 'true',
    });
    
    console.log('✅ Product created:', product.name, 'Price:', product.price);
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  // @desc    Update product (Admin only)
  const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, weight, category, image, inStock } = req.body;
    
    console.log('========== UPDATE REQUEST ==========');
    console.log('Product ID:', id);
    console.log('Received price:', price);
    console.log('Received inStock:', inStock);
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Update ALL fields
    product.name = name;
    product.description = description || '';
    product.price = Number(price);
    product.weight = weight || '';
    product.category = category;
    product.image = image || '';
    product.inStock = inStock === true || inStock === 'true';
    
    // Save the product
    await product.save();
    
    console.log('✅ Updated product:', product.name);
    console.log('✅ New price:', product.price);
    console.log('✅ New stock status:', product.inStock ? 'In Stock' : 'Out of Stock');
    console.log('=====================================');
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin only)
  const deleteProduct = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
     if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
     }
      await product.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
   getProductById,
   createProduct,
  updateProduct,
  deleteProduct,
};