import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">🏦 FinMini - Financial Trading Platform</h3>
          <p className="text-gray-300 text-sm">
            Built by <strong>Aftab</strong> for EnxtAI Full-Stack Developer Assignment
          </p>
        </div>
        
        <div className="border-t border-gray-600 pt-4">
          <p className="text-gray-400 text-sm">
            &copy; 2025 FinMini Trading Platform. All Rights Reserved by <strong>Aftab</strong>.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            EnxtAI Assignment • Deadline: September 28, 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
