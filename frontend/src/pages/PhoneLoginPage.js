import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useCart } from '../context/CartContext';

const PhoneLoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const { syncCartAfterLogin } = useCart();

  const statesList = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Rajasthan', 'Punjab', 'Telangana'];
  
  const citiesList = {
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

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      if (res.data.success) {
        toast.success('OTP sent!');
        if (res.data.demoOtp) {
          toast(`Demo OTP: ${res.data.demoOtp}`, { duration: 10000 });
        }
        setStep('otp');
        startTimer();
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      
      if (res.data.success) {
        localStorage.setItem('freshbasket_token', res.data.token);
        localStorage.setItem('freshbasket_user', JSON.stringify(res.data.user));
        await syncCartAfterLogin();
        
        if (res.data.needsProfile === true) {
          setShowProfile(true);
        } else {
          toast.success('Login successful!');
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/resend-otp', { phone });
      if (res.data.success) {
        toast.success('OTP resent!');
        if (res.data.demoOtp) toast(`Demo OTP: ${res.data.demoOtp}`, { duration: 10000 });
        startTimer();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!name || !state || !city) {
      toast.error('Please fill name, state and city');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/complete-profile', {
        name, city, state, address
      });
      
      if (res.data.success) {
        const user = JSON.parse(localStorage.getItem('freshbasket_user') || '{}');
        user.name = name;
        user.profileCompleted = true;
        user.address = res.data.user.address;
        localStorage.setItem('freshbasket_user', JSON.stringify(user));
        
        toast.success('Profile created! Welcome to FreshBasket!');
        navigate('/');
      }
    } catch (err) {
      console.error('Profile error:', err);
      toast.error(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  // PROFILE FORM
  if (showProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blinkit-yellow rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blinkit-dark">FB</span>
            </div>
            <h2 className="text-2xl font-bold text-blinkit-dark">Complete Your Profile</h2>
            <p className="text-gray-500">Please tell us about yourself</p>
          </div>

          <form onSubmit={handleCompleteProfile} className="space-y-4">
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
                onChange={(e) => { setState(e.target.value); setCity(''); }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
              >
                <option value="">Select State</option>
                {statesList.map(s => <option key={s} value={s}>{s}</option>)}
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
                {state && citiesList[state]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Address (Optional)</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your complete address"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blinkit-yellow text-blinkit-dark py-3 rounded-lg font-semibold hover:bg-yellow-400 transition mt-4"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGIN FORM
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blinkit-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blinkit-dark">FB</span>
          </div>
          <h1 className="text-3xl font-bold text-blinkit-dark">
            {step === 'phone' ? 'Welcome to FreshBasket' : 'Verify OTP'}
          </h1>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-3 bg-gray-100 rounded-lg border">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blinkit-yellow text-blinkit-dark py-3 rounded-full font-semibold">
              {loading ? 'Sending...' : 'Continue with OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blinkit-yellow text-blinkit-dark py-3 rounded-full font-semibold">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <div className="text-center">
              {timer > 0 ? (
                <span className="text-gray-500 text-sm">Resend OTP in {timer}s</span>
              ) : (
                <button type="button" onClick={handleResendOTP} className="text-blinkit-yellow text-sm">Resend OTP</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneLoginPage;