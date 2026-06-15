import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

// Icon mapping for AI-generated items (fallback when no image)
const getIngredientIcon = (name) => {
  const lowerName = name.toLowerCase();
  
  // Meat & Fish
  if (lowerName.includes('mutton')) return '🍖';
  if (lowerName.includes('chicken')) return '🍗';
  if (lowerName.includes('fish')) return '🐟';
  if (lowerName.includes('prawn')) return '🦐';
  
  // Vegetables
  if (lowerName.includes('onion')) return '🧅';
  if (lowerName.includes('tomato')) return '🍅';
  if (lowerName.includes('potato')) return '🥔';
  if (lowerName.includes('ginger')) return '🫚';
  if (lowerName.includes('garlic')) return '🧄';
  if (lowerName.includes('chili')) return '🌶️';
  
  // Dairy
  if (lowerName.includes('milk')) return '🥛';
  if (lowerName.includes('butter')) return '🧈';
  if (lowerName.includes('cheese')) return '🧀';
  if (lowerName.includes('cream')) return '🥛';
  if (lowerName.includes('yogurt')) return '🥛';
  if (lowerName.includes('paneer')) return '🧀';
  
  // Fruits
  if (lowerName.includes('apple')) return '🍎';
  if (lowerName.includes('banana')) return '🍌';
  if (lowerName.includes('mango')) return '🥭';
  
  // Grains
  if (lowerName.includes('rice')) return '🍚';
  if (lowerName.includes('flour')) return '🌾';
  if (lowerName.includes('poha')) return '🍲';
  if (lowerName.includes('pasta')) return '🍝';
  
  // Spices
  if (lowerName.includes('cumin')) return '🌿';
  if (lowerName.includes('coriander')) return '🌿';
  if (lowerName.includes('turmeric')) return '🌿';
  if (lowerName.includes('garam masala')) return '🌿';
  if (lowerName.includes('cardamom')) return '🌿';
  if (lowerName.includes('vanilla')) return '🌿';
  
  // Others
  if (lowerName.includes('sugar')) return '🍯';
  if (lowerName.includes('salt')) return '🧂';
  if (lowerName.includes('oil')) return '🫒';
  if (lowerName.includes('water')) return '💧';
  if (lowerName.includes('egg')) return '🥚';
  if (lowerName.includes('honey')) return '🍯';
  
  // Default: Return first letter of item name
  return name.charAt(0).toUpperCase();
};

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const platformFee = 10;
  const grandTotal = (cartTotal || 0) + platformFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    const token = localStorage.getItem('freshbasket_token');
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-blinkit-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
        <Link to="/" className="bg-blinkit-yellow text-blinkit-dark px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blinkit-dark mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  {/* Show REAL IMAGE if exists (database product), otherwise show ICON or LETTER */}
                  {item.image && item.image !== 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-bold text-blinkit-dark"
                    style={{ display: item.image && item.image !== 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' ? 'none' : 'flex' }}
                  >
                    {getIngredientIcon(item.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blinkit-dark">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.weight || '1 pack'}</p>
                    <p className="text-blinkit-dark font-bold mt-1">₹{item.price || 50}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center text-blinkit-dark hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-blinkit-dark hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={clearCart}
            className="mt-4 text-red-500 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-blinkit-dark mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price || 50) * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal || 0}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold">₹{platformFee}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blinkit-dark">₹{grandTotal}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full mt-6 bg-blinkit-yellow text-blinkit-dark py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;