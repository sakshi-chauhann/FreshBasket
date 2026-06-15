import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const categories = ['All', 'Vegetables & Fruits', 'Dairy & Breakfast', 'Meat & Fish', 'Personal Care', 'Cold Drinks & Juices', 'Pasta & Noodles', 'Bakery & Snacks', 'Cleaning Essentials'];

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    
    fetchProducts();
  }, [location]);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
            <h3 className="font-bold text-lg mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedCategory === cat 
                      ? 'bg-blinkit-yellow text-blinkit-dark font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          <h1 className="text-3xl font-bold text-blinkit-dark mb-6">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-gray-500 mb-4">{filteredProducts.length} products found</p>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;