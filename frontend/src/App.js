import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RecipePage from './pages/RecipePage';
import MyOrdersPage from './pages/MyOrdersPage';
import InvoicePage from './pages/InvoicePage';
import ProductListingPage from './pages/ProductListingPage';
import CheckoutPage from './pages/CheckoutPage';
import PhoneLoginPage from './pages/PhoneLoginPage';
import GoogleCallback from './pages/GoogleCallback';
import AdminProducts from './pages/AdminProducts';
import WishlistPage from './pages/WishlistPage';
import TrackingPage from './pages/TrackingPage';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/phone-login" element={<PhoneLoginPage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/tracking/:orderId" element={<TrackingPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>

        </div>
      </CartProvider>
    </Router>
  );
}

  export default App;