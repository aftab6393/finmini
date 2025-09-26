import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// Simplified validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && re.test(email);
};

const validatePAN = (pan) => {
  return pan && pan.length === 10;
};

// Toast notification component
const Toast = ({ toast }) => {
  if (!toast) return null;
  
  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transition-all duration-500 ${
      toast.type === 'success' 
        ? 'bg-green-500 text-white border-l-4 border-green-300' 
        : 'bg-red-500 text-white border-l-4 border-red-300'
    }`}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">
          {toast.type === 'success' ? '✅' : '❌'}
        </span>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

export default function Signup() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pan: ''
  });
  const [kycFile, setKycFile] = useState(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fill demo data
  const fillDemoData = () => {
    setFormData({
      name: 'Aftab Demo User',
      email: 'aftab.demo@example.com',
      password: 'password123',
      pan: 'ABCDE1234F'
    });
    showToast('Demo data filled! Now proceed to KYC step.', 'success');
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycFile(file);
    }
  };

  // Handle next step (simplified validation)
  const handleNextStep = () => {
    if (!formData.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    setCurrentStep(2);
    showToast('Step 1 completed! Now complete KYC verification.', 'success');
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePAN(formData.pan)) {
      showToast('Please enter a valid 10-character PAN', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('email', formData.email.toLowerCase());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('pan', formData.pan.toUpperCase());
      
      if (kycFile) {
        formDataToSend.append('kycImage', kycFile);
      }

      console.log('Submitting registration...'); // Debug log

      const response = await api.post('/auth/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Registration successful:', response.data); // Debug log
      
      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Success feedback
      showToast('🎉 Account created successfully! Redirecting...', 'success');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">🆔</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join FinMini</h2>
            <p className="text-gray-600">Create account with secure KYC verification</p>
          </div>

          {/* Demo Data Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={fillDemoData}
              className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              📝 Fill Demo Data (Quick Test)
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep >= 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </span>
              <span className="text-sm font-medium">Account</span>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </span>
              <span className="text-sm font-medium">KYC</span>
            </div>
          </div>

          {/* Form */}
          <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Enter your personal details</p>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Create a strong password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="text-gray-400 hover:text-gray-600">
                        {showPassword ? '🙈' : '👁️'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  Continue to KYC ➡️
                </button>
              </>
            )}

            {/* Step 2: KYC Verification */}
            {currentStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">KYC Verification</h3>
                  <p className="text-sm text-gray-600 mt-1">Complete your identity verification</p>
                </div>

                {/* PAN Number */}
                <div>
                  <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    id="pan"
                    type="text"
                    value={formData.pan}
                    onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your 10-character PAN number (format: ABCDE1234F)
                  </p>
                </div>

                {/* KYC Document Upload */}
                <div>
                  <label htmlFor="kyc" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Document Upload (Optional)
                  </label>
                  <input
                    id="kyc"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                  {kycFile && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ {kycFile.name} ({(kycFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    ← Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </span>
                    ) : (
                      '🎉 Create Account'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Built for EnxtAI Full-Stack Developer Assignment</p>
          </div>
        </div>
      </div>
    </>
  );
}
