import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import errorHandler from '../utils/errorHandler';

// Toast notification component
const Toast = ({ toast }) => {
  if (!toast) return null;
  
  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transition-all duration-500 transform ${
      toast.type === 'success' 
        ? 'bg-green-500 text-white border-l-4 border-green-300' 
        : 'bg-red-500 text-white border-l-4 border-red-300'
    } animate-slide-in-right`}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">
          {toast.type === 'success' ? '✅' : '❌'}
        </span>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

export default function Login() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Real-time validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        const emailError = errorHandler.validateEmail(value);
        if (emailError) newErrors.email = emailError;
        else delete newErrors.email;
        break;
      case 'password':
        const passwordError = errorHandler.validatePassword(value);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;
        break;
    }
    
    setErrors(newErrors);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const emailError = errorHandler.validateEmail(email);
    const passwordError = errorHandler.validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ 
        email: emailError, 
        password: passwordError 
      });
      showToast('Please fix the errors below', 'error');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Success feedback
      showToast(errorHandler.getSuccessMessage('login', response.data.user), 'success');
      
      // Redirect after short delay for UX
      setTimeout(() => {
        navigate('/products');
      }, 1000);
      
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Login');
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials auto-fill
  const fillDemoCredentials = (userType) => {
    if (userType === 'user') {
      setEmail('test@demo.com');
      setPassword('password123');
    } else if (userType === 'admin') {
      setEmail('admin@finmini.com');
      setPassword('admin123');
    }
    setErrors({});
    showToast(`Demo ${userType} credentials filled!`, 'success');
  };

  return (
    <>
      <Toast toast={toast} />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">₹</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your FinMini account</p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-blue-900 text-sm">🚀 Quick Demo Access</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                👤 Demo User
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                👨‍💼 Admin
              </button>
            </div>
            <p className="text-xs text-blue-700">
              Demo user has ₹1,00,000 wallet • Admin has full access
            </p>
          </div>

          {/* Login Form */}
          <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">📧</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField('email', e.target.value);
                  }}
                  className={`appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">🔒</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                  }}
                  className={`appearance-none rounded-xl relative block w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || Object.keys(errors).length > 0}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                  isLoading || Object.keys(errors).length > 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Sign In</span>
                  </div>
                )}
              </button>
            </div>

            {/* Additional Links */}
            <div className="flex items-center justify-between text-sm">
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
              >
                Don't have an account? Sign up
              </Link>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => showToast('Contact admin for password reset', 'info')}
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Secured by JWT Authentication</p>
            <p className="mt-1">Built for Full-Stack Developer Assignment</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
