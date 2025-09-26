import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import errorHandler from '../utils/errorHandler';

// Toast notification component
const Toast = ({ toast }) => {
  if (!toast) return null;
  
  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transition-all duration-500 ${
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

// Loading skeleton component
const WatchlistSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyWatchlist = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-4xl">👁️</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Watchlist is Empty</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start building your watchlist by adding stocks and mutual funds you want to track.
    </p>
    <Link 
      to="/products"
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      <span>🔍</span>
      <span>Explore Investment Options</span>
    </Link>
  </div>
);

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch watchlist
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/watchlist');
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Watchlist Fetch');
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Remove from watchlist
  const handleRemove = async (productId, productName) => {
    if (removingIds.has(productId)) return;

    setRemovingIds(prev => new Set([...prev, productId]));

    try {
      await api.post(`/users/watchlist/${productId}`);
      setWatchlist(prev => prev.filter(p => p._id !== productId));
      showToast(`Removed ${productName} from watchlist`, 'success');
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Remove from Watchlist');
      showToast(message, 'error');
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Get company icon
  const getCompanyIcon = (name) => {
    if (name.includes('Reliance')) return '🛢️';
    if (name.includes('TCS')) return '💻';
    if (name.includes('HDFC')) return '🏦';
    if (name.includes('Infosys')) return '🌐';
    if (name.includes('SBI')) return '💼';
    if (name.includes('Axis')) return '📈';
    return name.includes('Stock') ? '📊' : '💼';
  };

  // Filter watchlist based on search
  const filteredWatchlist = watchlist.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <>
      <Toast toast={toast} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
            <p className="text-gray-600">Track your favorite investment opportunities</p>
          </div>
          
          {watchlist.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">{watchlist.length} items</span>
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Add More</span>
              </Link>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {watchlist.length > 0 && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <WatchlistSkeleton />
        ) : watchlist.length === 0 ? (
          <EmptyWatchlist />
        ) : filteredWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching items</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWatchlist.map((product) => {
              const isStock = product.category === 'Stock';
              const priceChange = product.priceHistory?.length > 1 
                ? ((product.pricePerUnit - product.priceHistory[product.priceHistory.length - 2]) / product.priceHistory[product.priceHistory.length - 2] * 100)
                : 0;
              const isRemoving = removingIds.has(product._id);

              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Product Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          isStock ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
                        }`}>
                          <span className="text-xl">
                            {getCompanyIcon(product.name)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <Link
                            to={`/products/${product._id}`}
                            className="block group-hover:text-blue-600 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-500">{product.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isStock ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {product.metric}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{product.pricePerUnit.toLocaleString('en-IN')}
                          </div>
                          
                          {priceChange !== 0 && (
                            <div className={`flex items-center justify-end space-x-1 mt-1 ${
                              priceChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <span className="text-sm">
                                {priceChange > 0 ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Link
                            to={`/products/${product._id}`}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-center ${
                              isStock 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {isStock ? '🚀 Trade' : '💰 Invest'}
                          </Link>
                          
                          <button
                            onClick={() => handleRemove(product._id, product.name)}
                            disabled={isRemoving}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                              isRemoving
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            {isRemoving ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 border border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                                <span>Removing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <span>🗑️</span>
                                <span>Remove</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart Preview */}
                  {product.priceHistory?.length > 2 && (
                    <div className="px-6 pb-4">
                      <div className="h-12 flex items-end space-x-1 bg-gray-50 rounded-lg p-2">
                        {product.priceHistory.slice(-7).map((price, i) => {
                          const maxPrice = Math.max(...product.priceHistory);
                          const height = (price / maxPrice) * 32;
                          
                          return (
                            <div 
                              key={i}
                              className={`flex-1 rounded-t transition-all duration-300 ${
                                priceChange > 0 ? 'bg-green-400' : 'bg-red-400'
                              }`}
                              style={{ height: `${height}px`, minHeight: '4px' }}
                              title={`₹${price.toFixed(2)}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions Footer */}
        {watchlist.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Ready to Invest?</h3>
              <p className="text-gray-600 mb-4">
                Your watchlist contains {watchlist.length} investment opportunities. Start building your portfolio today!
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/portfolio"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <span>📊</span>
                  <span>View Portfolio</span>
                </Link>
                <Link
                  to="/products"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <span>🔍</span>
                  <span>Explore More</span>
                </Link>
              </div>
            </div>
          </div>
        )}
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
