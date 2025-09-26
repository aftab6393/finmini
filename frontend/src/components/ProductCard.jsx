//  import React from 'react';
//  import { Link } from 'react-router-dom';
//  export default function ProductCard({ p }) {
//  return (
//  <div className="bg-white p-4 rounded shadow">
//  <h3 className="font-semibold">{p.name}</h3>
//  <p className="text-sm text-gray-600">{p.category} • {p.metric}</p>
//  <div className="mt-3 flex items-baseline justify-between">
//  <div>
//  <div className="text-lg font-bold">₹{p.pricePerUnit.toFixed(2)}</
//  div>
//  </div>
//  <Link to={`/products/${p._id}`} className="text-sm text
// blue-600">View</Link>
//  </div>
//  </div>
//  );
//  }
// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Toast notification hook (add this at the top)
export const useToast = () => {
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  return { toast, showToast };
};

// Toast component for notifications
export const Toast = ({ toast }) => {
  if (!toast) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      toast.type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {toast.message}
    </div>
  );
};

// Enhanced ProductCard component
export default function ProductCard({ p, onWatchlistToggle }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  const isStock = p.category === 'Stock';
  const priceChange = p.priceHistory?.length > 1 
    ? ((p.pricePerUnit - p.priceHistory[p.priceHistory.length - 2]) / p.priceHistory[p.priceHistory.length - 2] * 100)
    : 0;

  const handleWatchlistToggle = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      // This would integrate with your API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setIsInWatchlist(!isInWatchlist);
      if (onWatchlistToggle) {
        onWatchlistToggle(p._id, !isInWatchlist);
      }
    } catch (error) {
      console.error('Watchlist error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyIcon = (name) => {
    if (name.includes('Reliance')) return '🛢️';
    if (name.includes('TCS')) return '💻';
    if (name.includes('HDFC')) return '🏦';
    if (name.includes('Infosys')) return '🌐';
    if (name.includes('SBI')) return '💼';
    if (name.includes('Axis')) return '📈';
    return isStock ? '📊' : '💼';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1">
      {/* Header with Watchlist Button */}
      <div className="p-6 pb-4 relative">
        <button
          onClick={handleWatchlistToggle}
          disabled={isLoading}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isInWatchlist 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
          } ${isLoading ? 'animate-pulse' : ''}`}
          title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {isLoading ? '⏳' : (isInWatchlist ? '❤️' : '🤍')}
        </button>

        <div className="flex justify-between items-start mb-3 pr-10">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
              isStock ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
            }`}>
              <span className="text-xl">
                {getCompanyIcon(p.name)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg leading-tight">
                {p.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">{p.category}</span>
                <span className="text-gray-300">•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isStock ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {p.metric}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        {priceChange !== 0 && (
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            priceChange > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>{priceChange > 0 ? '📈' : '📉'}</span>
            <span>{priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="px-6 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{p.pricePerUnit.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500">
              Per {isStock ? 'Share' : 'Unit'}
            </div>
          </div>
          <Link 
            to={`/products/${p._id}`}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-sm ${
              isStock 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200' 
                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200'
            } hover:shadow-lg`}
          >
            {isStock ? '🚀 Trade' : '💰 Invest'}
          </Link>
        </div>
      </div>

      {/* Mini Chart Preview - Enhanced */}
      {p.priceHistory?.length > 2 && (
        <div className="px-6 pb-6">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Price Trend</span>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
          <div className="h-16 flex items-end space-x-1 bg-gray-50 rounded-lg p-2">
            {p.priceHistory.slice(-7).map((price, i) => {
              const maxPrice = Math.max(...p.priceHistory);
              const height = (price / maxPrice) * 48;
              const isLast = i === p.priceHistory.slice(-7).length - 1;
              
              return (
                <div 
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-300 hover:opacity-80 ${
                    isLast 
                      ? (priceChange > 0 ? 'bg-green-500' : 'bg-red-500')
                      : (priceChange > 0 ? 'bg-green-300' : 'bg-red-300')
                  }`}
                  style={{ height: `${height}px`, minHeight: '4px' }}
                  title={`₹${price.toFixed(2)}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Info Footer */}
      <div className={`px-6 py-3 border-t transition-colors ${
        isStock ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'
      } group-hover:bg-opacity-80`}>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {isStock ? 'Market Cap' : 'AUM'}: {isStock ? '₹2.1L Cr' : '₹850 Cr'}
          </span>
          <span className={`font-medium ${
            isStock ? 'text-blue-700' : 'text-green-700'
          }`}>
            {isStock ? 'NSE Listed' : 'SEBI Registered'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 border animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
      
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

// Error boundary for robust error handling
export const ProductCardError = ({ error, retry }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-red-200 text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="font-semibold text-gray-900 mb-2">Failed to Load Product</h3>
      <p className="text-sm text-gray-600 mb-4">
        {error?.message || 'Something went wrong while loading this investment product.'}
      </p>
      <button 
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  );
};
