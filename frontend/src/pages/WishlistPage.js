import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      const items = response.data.wishlist.items || [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      setWishlistItems(wishlistItems.filter(item => item.productId._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const addToCartHandler = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-blinkit-dark">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items here!</p>
          <Link to="/" className="bg-blinkit-yellow text-blinkit-dark px-6 py-2 rounded-full font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map(({ productId: product }) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-blinkit-dark">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{product.weight || '1kg'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-blinkit-dark">₹{product.price}</span>
                  <button
                    onClick={() => addToCartHandler(product)}
                    className="bg-blinkit-yellow text-blinkit-dark px-4 py-1.5 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;