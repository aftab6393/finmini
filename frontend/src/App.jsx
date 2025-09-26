import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // ← ADD THIS LINE
import Admin from './pages/Admin';




export default function App() {
  return (
    <div className="min-h-screen flex flex-col"> {/* ← ADD flex flex-col */}
      <Navbar />
      <div className="container mx-auto p-4 flex-1"> {/* ← ADD flex-1 */}
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer /> {/* ← ADD THIS LINE */}
    </div>
  );
}
