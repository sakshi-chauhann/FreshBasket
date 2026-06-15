import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, ShoppingBag } from 'lucide-react';
import api from '../utils/axiosConfig';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped': return <Package className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-blinkit-dark mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders yet</p>
          <Link to="/" className="inline-block mt-4 bg-blinkit-yellow text-blinkit-dark px-6 py-2 rounded-full font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-blinkit-dark">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.orderStatus)}
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
                <div>
                  <span className="font-bold text-blinkit-dark">₹{order.totalAmount}</span>
                </div>
              </div>
              
              <div className="p-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-gray-500 text-sm mt-2">+{order.items.length - 3} more items</p>
                )}
              </div>
              
             <div className="p-4 bg-gray-50 flex gap-4">
              <Link to={`/invoice/${order._id}`} className="text-blinkit-yellow font-semibold hover:underline">
               View Invoice →
              </Link>
              <Link to={`/tracking/${order._id}`} className="text-blinkit-yellow font-semibold hover:underline">
              Track Order →
  </Link>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;