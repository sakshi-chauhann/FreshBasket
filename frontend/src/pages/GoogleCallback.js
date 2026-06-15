import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartAfterLogin } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (token && userParam) {
      localStorage.setItem('freshbasket_token', token);
      localStorage.setItem('freshbasket_user', userParam);
      syncCartAfterLogin();
      toast.success('Google login successful!');
      navigate('/');
    } else {
      toast.error('Google login failed');
      navigate('/login');
    }
  }, [location, navigate, syncCartAfterLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
    </div>
  );
};

export default GoogleCallback;