import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard, { ProductCardSkeleton, ProductCardError } from '../components/ProductCard';
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

// Market stats component
const MarketStats = ({ products }) => {
  const stocks = products.filter(p => p.category === 'Stock');
  const mutualFunds = products.filter(p => p.category === 'Mutual Fund');
  
  const avgStockPrice = stocks.length > 0 
    ? stocks.reduce((sum, s) => sum + s.pricePerUnit, 0) / stocks.length 
    : 0;
  
  const totalMarketValue = products.reduce((sum, p) => sum + p.pricePerUnit, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
        <div className="text-2xl font-bold text-blue-900">{stocks.length}</div>
        <div className="text-sm text-blue-600">📈 Stocks Available</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
        <div className="text-2xl font-bold text-green-900">{mutualFunds.length}</div>
        <div className="text-sm text-green-600">💼 Mutual Funds</div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
        <div className="text-2xl font-bold text-purple-900">₹{avgStockPrice.toFixed(0)}</div>
        <div className="text-sm text-purple-600">📊 Avg Stock Price</div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
        <div className="text-2xl font-bold text-indigo-900">₹{totalMarketValue.toFixed(0)}</div>
        <div className="text-sm text-indigo-600">💰 Total Value</div>
      </div>
    </div>
  );
};

// Empty state component
const EmptyProducts = ({ onRetry }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-4xl">📊</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Investment Products</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      We couldn't find any investment products. Please try refreshing or contact support.
    </p>
    <button 
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
    >
      🔄 Refresh Products
    </button>
  </div>
);

export default function Products() {
  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // UI state
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // User wallet (from localStorage)
  const [walletBalance, setWalletBalance] = useState(0);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
      
      // Get user wallet balance
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setWalletBalance(userData.walletBalance || 100000);
      
    } catch (error) {
      setError(error);
      const message = errorHandler.handleApiError(error, null, 'Products Fetch');
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Watchlist handler
  const handleWatchlistToggle = (productId, isAdding) => {
    showToast(
      isAdding ? '⭐ Added to watchlist!' : '🗑️ Removed from watchlist',
      'success'
    );
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.pricePerUnit;
          bValue = b.pricePerUnit;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Toast toast={toast} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Markets</h1>
            <p className="text-gray-600">
              Discover and invest in top-performing stocks and mutual funds
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
              <div className="text-sm text-blue-600">💰 Wallet Balance</div>
              <div className="font-bold text-blue-900">₹{walletBalance.toLocaleString('en-IN')}</div>
            </div>
            <Link
              to="/portfolio"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Market Statistics */}
        {!loading && !error && products.length > 0 && (
          <MarketStats products={products} />
        )}

        {/* Search and Filters */}
        {!loading && !error && products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Investments
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search stocks, mutual funds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Stock">📈 Stocks</option>
                  <option value="Mutual Fund">💼 Mutual Funds</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="category">Category</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} of {products.length} investments
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <ProductCardError 
              error={error} 
              retry={fetchProducts}
            />
          </div>
        ) : products.length === 0 ? (
          <EmptyProducts onRetry={fetchProducts} />
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching investments</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedProducts.map(product => (
              <ProductCard 
                key={product._id} 
                p={product} 
                onWatchlistToggle={handleWatchlistToggle}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Quick Actions Footer */}
        {!loading && !error && products.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start Investing?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of investors building wealth through our curated selection of {products.length} top-performing 
                stocks and mutual funds. Start with as little as ₹100!
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>SEBI Regulated</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>⚡</span>
                  <span>Instant Trading</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>📊</span>
                  <span>Real-time Analytics</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                <Link
                  to="/watchlist"
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>👁️</span>
                  <span>View Watchlist</span>
                </Link>
                <Link
                  to="/portfolio"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>📈</span>
                  <span>Manage Portfolio</span>
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
