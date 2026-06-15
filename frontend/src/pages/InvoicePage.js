import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ShoppingBag } from 'lucide-react';
import api from '../utils/axiosConfig';

const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p>Order not found</p>
        <Link to="/" className="text-blinkit-yellow">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden" id="invoice">
        {/* Header */}
        <div className="bg-blinkit-yellow p-6 text-center">
          <h1 className="text-3xl font-bold text-blinkit-dark">FreshBasket</h1>
          <p className="text-blinkit-dark/80">Order Invoice</p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
              <p className="text-gray-500 mt-2">Date</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Payment Status</p>
              <p className="text-green-600 font-semibold capitalize">{order.paymentStatus}</p>
              <p className="text-gray-500 mt-2">Payment ID</p>
              <p className="text-sm">{order.paymentId || 'N/A'}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-b py-4 my-4">
            <h2 className="font-bold text-lg mb-3">Items Ordered</h2>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{order.platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total Amount</span>
              <span className="text-blinkit-yellow">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="border-t pt-4 mt-4">
              <h2 className="font-bold mb-2">Delivery Address</h2>
              <p>{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}</p>
              <p>{order.address.city} - {order.address.pincode}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-6 pt-4 border-t flex-wrap">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <Link to="/" className="flex items-center gap-2 bg-blinkit-yellow text-blinkit-dark px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;