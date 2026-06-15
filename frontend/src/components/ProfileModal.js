import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const citiesByState = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Delhi': ['New Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad'],
};

const states = Object.keys(citiesByState);

const ProfileModal = ({ isOpen, onClose, onComplete }) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !state || !city) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/complete-profile', {
        name,
        city,
        state,
        address,
        pincode,
      });

      if (response.data.success) {
        // Update stored user data
        const user = JSON.parse(localStorage.getItem('freshbasket_user') || '{}');
        user.name = name;
        user.profileCompleted = true;
        user.address = response.data.user.address;
        localStorage.setItem('freshbasket_user', JSON.stringify(user));
        
        toast.success('Profile created successfully!');
        onComplete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blinkit-yellow rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-blinkit-dark">FB</span>
          </div>
          <h2 className="text-2xl font-bold text-blinkit-dark">Complete Your Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Tell us about yourself to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">State *</label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity('');
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
            >
              <option value="">Select State</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">City *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!state}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow disabled:bg-gray-100"
            >
              <option value="">Select City</option>
              {state && citiesByState[state]?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Address (Optional)</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your complete address"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Pincode (Optional)</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.slice(0, 6))}
              placeholder="6 digit pincode"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blinkit-yellow text-blinkit-dark py-3 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          This information helps us deliver your orders faster
        </p>
      </div>
    </div>
  );
};

export default ProfileModal;