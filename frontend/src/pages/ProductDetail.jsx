import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../api';
import errorHandler from '../utils/errorHandler';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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

// Loading skeleton
const ProductDetailSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="bg-white rounded-2xl p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="h-20 bg-gray-200 rounded mb-6"></div>
      <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex space-x-4">
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
        <div className="h-12 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    <div className="bg-white rounded-2xl p-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Transaction state
  const [units, setUnits] = useState(1);
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState(null);
  
  // UI state
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  
  // User wallet (from localStorage)
  const [walletBalance, setWalletBalance] = useState(0);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Get user data for wallet balance
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setWalletBalance(userData.walletBalance || 100000);
      
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Product Fetch');
      showToast(message, 'error');
      
      if (error.response?.status === 404) {
        setTimeout(() => navigate('/products'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle buy transaction
  const handleBuy = async () => {
    // Validation
    const unitsError = errorHandler.validateUnits(units, 1000);
    const totalAmount = parseFloat(units) * product.pricePerUnit;
    const balanceError = errorHandler.validateWalletBalance(totalAmount, walletBalance);
    
    if (unitsError || balanceError) {
      showToast(unitsError || balanceError, 'error');
      return;
    }

    setBuying(true);

    try {
      const response = await api.post('/transactions/buy', { 
        productId: product._id, 
        units: parseFloat(units) 
      });
      
      // Update wallet balance
      const newBalance = response.data.walletBalance;
      setWalletBalance(newBalance);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.walletBalance = newBalance;
      localStorage.setItem('user', JSON.stringify(userData));
      
      showToast(errorHandler.getSuccessMessage('purchase', {
        units,
        productName: product.name
      }), 'success');
      
      // Reset units
      setUnits(1);
      
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Purchase');
      showToast(message, 'error');
    } finally {
      setBuying(false);
    }
  };

  // Handle watchlist toggle
  const handleWatchlistToggle = async () => {
    setAddingToWatchlist(true);
    
    try {
      await api.post(`/users/watchlist/${product._id}`);
      setIsInWatchlist(!isInWatchlist);
      showToast(
        isInWatchlist 
          ? 'Removed from watchlist' 
          : 'Added to watchlist', 
        'success'
      );
    } catch (error) {
      const message = errorHandler.handleApiError(error, null, 'Watchlist');
      showToast(message, 'error');
    } finally {
      setAddingToWatchlist(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The investment product you're looking for doesn't exist.</p>
          <Link 
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isStock = product.category === 'Stock';
  const totalCost = parseFloat(units || 0) * product.pricePerUnit;
  const priceChange = product.priceHistory?.length > 1 
    ? ((product.pricePerUnit - product.priceHistory[product.priceHistory.length - 2]) / product.priceHistory[product.priceHistory.length - 2] * 100)
    : 0;

  // Chart configuration
  const chartLabels = product.priceHistory.map((_, i) => `Day ${i + 1}`);
  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: `${product.name} Price`,
      data: product.priceHistory,
      borderColor: priceChange >= 0 ? '#10b981' : '#ef4444',
      backgroundColor: priceChange >= 0 
        ? 'rgba(16, 185, 129, 0.1)' 
        : 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: priceChange >= 0 ? '#10b981' : '#ef4444',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${product.name} - Price History`,
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: priceChange >= 0 ? '#10b981' : '#ef4444',
        borderWidth: 1,
        callbacks: {
          label: (context) => `Price: ₹${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value) => `₹${value}`
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    }
  };

  return (
    <>
      <Toast toast={toast} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/products" className="text-blue-600 hover:text-blue-800">Products</Link>
          <span className="text-gray-500">›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                    isStock ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <span className="text-3xl">
                      {getCompanyIcon(product.name)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">{product.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isStock ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {product.metric}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWatchlistToggle}
                  disabled={addingToWatchlist}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isInWatchlist 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                  } ${addingToWatchlist ? 'animate-pulse' : ''}`}
                >
                  {addingToWatchlist ? '⏳' : (isInWatchlist ? '❤️' : '🤍')}
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Price Section */}
              <div className="mb-8">
                <div className="flex items-baseline space-x-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.pricePerUnit.toLocaleString('en-IN')}
                  </span>
                  {priceChange !== 0 && (
                    <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                      priceChange > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span>{priceChange > 0 ? '📈' : '📉'}</span>
                      <span>{priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">Per {isStock ? 'Share' : 'Unit'}</span>
              </div>

              {/* Trading Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isStock ? '🚀 Trade Stock' : '💰 Invest Now'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of {isStock ? 'Shares' : 'Units'}
                    </label>
                    <input
                      type="number"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter quantity"
                      min="1"
                      max="1000"
                      disabled={buying}
                    />
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Investment Amount:</span>
                      <span className="font-semibold">₹{totalCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Wallet Balance:</span>
                      <span className={`font-semibold ${
                        walletBalance >= totalCost ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{walletBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={buying || !units || parseFloat(units) <= 0 || totalCost > walletBalance}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      buying || !units || parseFloat(units) <= 0 || totalCost > walletBalance
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : `${isStock 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                        } text-white transform hover:scale-105 shadow-lg hover:shadow-xl`
                    }`}
                  >
                    {buying ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : totalCost > walletBalance ? (
                      '💳 Insufficient Balance'
                    ) : (
                      `${isStock ? '🚀' : '💰'} ${isStock ? 'Buy Stock' : 'Invest Now'}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Price Analysis</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📊</span>
                  <span>Historical Performance</span>
                </div>
              </div>
              
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>

              {/* Chart Statistics */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{Math.max(...product.priceHistory).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">52W High</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{Math.min(...product.priceHistory).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">52W Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            ← Back to Products
          </Link>
          <Link
            to="/portfolio"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            View Portfolio →
          </Link>
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
