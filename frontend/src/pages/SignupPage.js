import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('freshbasket_token', response.data.token);
        localStorage.setItem('freshbasket_user', JSON.stringify(response.data.user));
        
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blinkit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blinkit-dark">FB</span>
          </div>
          <h1 className="text-3xl font-bold text-blinkit-dark">Create Account</h1>
          <p className="text-gray-500 mt-2">Join FreshBasket today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
              placeholder="Create a password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blinkit-yellow text-blinkit-dark py-3 rounded-full font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blinkit-yellow font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;