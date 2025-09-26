// Enhanced Error Handler with Financial App Context
export const getErrorMessage = (error) => {
  // Network or connection errors
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      return '🌐 Network error. Please check your connection and try again.';
    }
    if (error.code === 'ECONNABORTED') {
      return '⏱️ Request timeout. Server is taking too long to respond.';
    }
    return '🔌 Unable to connect to server. Please try again later.';
  }

  const { status, data } = error.response;
  const serverMessage = data?.message || '';

  // Authentication & Authorization errors
  if (status === 401) {
    if (serverMessage.includes('token')) {
      return '🔒 Your session has expired. Please login again.';
    }
    if (serverMessage.includes('Invalid creds')) {
      return '❌ Invalid email or password. Please check and try again.';
    }
    return '🔒 Authentication required. Please login to continue.';
  }

  if (status === 403) {
    return '🚫 Access denied. You don\'t have permission for this action.';
  }

  // Client errors (400-499)
  if (status === 400) {
    if (serverMessage.includes('Insufficient balance') || serverMessage.includes('wallet balance')) {
      return '💳 Insufficient wallet balance. Please add funds to continue.';
    }
    if (serverMessage.includes('Invalid units') || serverMessage.includes('units')) {
      return '📊 Please enter a valid number of units to purchase.';
    }
    if (serverMessage.includes('User exists')) {
      return '👤 An account with this email already exists. Please login instead.';
    }
    if (serverMessage.includes('PAN')) {
      return '🆔 Please provide a valid PAN number for KYC verification.';
    }
    return `❌ ${serverMessage || 'Invalid request. Please check your input.'}`;
  }

  if (status === 404) {
    if (serverMessage.includes('Product')) {
      return '🔍 Investment product not found. It may have been removed.';
    }
    if (serverMessage.includes('User')) {
      return '👤 User account not found. Please contact support.';
    }
    return '🔍 Requested resource not found.';
  }

  if (status === 409) {
    return '⚠️ This action conflicts with existing data. Please refresh and try again.';
  }

  if (status === 422) {
    return '📝 Please check all required fields and ensure data is valid.';
  }

  if (status === 429) {
    return '🚦 Too many requests. Please wait a moment before trying again.';
  }

  // Server errors (500-599)
  if (status >= 500) {
    if (status === 500) {
      return '🔧 Server error occurred. Our team has been notified. Please try again.';
    }
    if (status === 502 || status === 503) {
      return '⚠️ Service temporarily unavailable. Please try again in a few minutes.';
    }
    if (status === 504) {
      return '⏱️ Gateway timeout. Please try again later.';
    }
    return '🔧 Server is experiencing issues. Please try again later.';
  }

  // Fallback for unknown errors
  return '⚠️ Something unexpected happened. Please try again or contact support.';
};

// Enhanced error handler with logging and user feedback
export const handleApiError = (error, showToast = null, context = '') => {
  const message = getErrorMessage(error);
  
  // Log error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.group(`🚨 API Error${context ? ` - ${context}` : ''}`);
    console.error('Error object:', error);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('URL:', error.config?.url);
    console.groupEnd();
  }

  // Show toast notification if available
  if (showToast) {
    showToast(message, 'error');
  }

  return message;
};

// Validation helpers for forms
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!re.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!pan) return 'PAN number is required for KYC';
  if (!panRegex.test(pan)) return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateUnits = (units, maxUnits = 1000) => {
  const num = parseFloat(units);
  if (!units) return 'Please enter number of units';
  if (isNaN(num) || num <= 0) return 'Please enter a valid positive number';
  if (num > maxUnits) return `Maximum ${maxUnits} units allowed per transaction`;
  return null;
};

export const validateWalletBalance = (amount, walletBalance) => {
  if (amount > walletBalance) {
    return `Insufficient balance. You have ₹${walletBalance.toLocaleString()} available`;
  }
  return null;
};

// Success message helper
export const getSuccessMessage = (action, data = {}) => {
  switch (action) {
    case 'login':
      return `🎉 Welcome back, ${data.name || 'User'}!`;
    case 'register':
      return '🎉 Account created successfully! Welcome to FinMini!';
    case 'purchase':
      return `✅ Successfully purchased ${data.units} units of ${data.productName}!`;
    case 'watchlist_add':
      return '⭐ Added to your watchlist!';
    case 'watchlist_remove':
      return '🗑️ Removed from watchlist';
    case 'kyc_upload':
      return '📄 KYC document uploaded successfully!';
    default:
      return '✅ Action completed successfully!';
  }
};

// Format currency for Indian locale
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

// Format large numbers in Indian style (Lakhs/Crores)
export const formatIndianNumber = (num) => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Retry mechanism for failed API calls
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error; // Don't retry auth errors
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Export all utilities as default object
export default {
  getErrorMessage,
  handleApiError,
  validateEmail,
  validatePAN,
  validatePassword,
  validateUnits,
  validateWalletBalance,
  getSuccessMessage,
  formatCurrency,
  formatIndianNumber,
  retryApiCall
};
