//  import React from 'react';
//  import { Link, useNavigate } from 'react-router-dom';
//  export default function Navbar() {
//  const navigate = useNavigate();
//  const token = localStorage.getItem('token');
//  const logout = () => { localStorage.removeItem('token');
//  localStorage.removeItem('user'); navigate('/login'); };
//  return (
//  <nav className="bg-white shadow">
//  <div className="container mx-auto p-4 flex justify-between items
// center">
//  <div className="flex items-center gap-4">
//  <Link to="/" className="font-bold text-xl">FinMini</Link>
//  </div>
//  <div className="flex items-center gap-4">
//  <Link to="/products" className="hover:underline">Products</Link>
//  <Link to="/portfolio" className="hover:underline">Portfolio</Link>
//  <Link to="/watchlist" className="hover:underline">Watchlist</Link>
//  {token ? (
//  <button onClick={logout} className="px-3 py-1 rounded bg-red-500 
// text-white">Logout</button>
//  ) : (
//  <>
//  <Link to="/login" className="px-3 py-1 rounded bg-blue-500 
// text-white">Login</Link>
//  <Link to="/signup" className="px-3 py-1 rounded 
// border">Signup</Link>
//  </>
//  )}
//  </div>
//  </div>
//  </nav>
//  );
//  }
// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-fin-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-fin-blue-500 to-fin-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <Link to="/" className="font-bold text-xl text-fin-gray-900 font-finance">
              FinMini
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className={`${isActive('/products') ? 'text-fin-blue-600 border-b-2 border-fin-blue-600' : 'text-fin-gray-600 hover:text-fin-blue-600'} pb-1 transition-colors font-medium`}
            >
              Markets
            </Link>
            {token && (
              <>
                <Link 
                  to="/portfolio" 
                  className={`${isActive('/portfolio') ? 'text-fin-blue-600 border-b-2 border-fin-blue-600' : 'text-fin-gray-600 hover:text-fin-blue-600'} pb-1 transition-colors font-medium`}
                >
                  Portfolio
                </Link>
                <Link 
                  to="/watchlist" 
                  className={`${isActive('/watchlist') ? 'text-fin-blue-600 border-b-2 border-fin-blue-600' : 'text-fin-gray-600 hover:text-fin-blue-600'} pb-1 transition-colors font-medium`}
                >
                  Watchlist
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-fin-gray-900">₹{user.walletBalance?.toLocaleString() || '1,00,000'}</div>
                  <div className="text-xs text-fin-gray-500">Wallet Balance</div>
                </div>
                <div className="w-8 h-8 bg-fin-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-fin-blue-600 font-semibold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-fin-red-500 hover:bg-fin-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="bg-fin-blue-600 hover:bg-fin-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="border border-fin-blue-600 text-fin-blue-600 hover:bg-fin-blue-50 px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
