// import React, { useEffect, useState } from 'react';
//  import api from '../api';
//  export default function Portfolio() {
//  const [data, setData] = useState(null);
//  useEffect(()=>{
//  api.get('/users/portfolio').then(res =>
//  setData(res.data)).catch(console.error);
//  },[]);
//  if (!data) return <div>Loading...</div>;
//  return (
//  <div>
//  <h1 className="text-2xl mb-4">Portfolio</h1>
//  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//  <div className="bg-white p-4 rounded shadow">
//  <div className="text-sm text-gray-500">Wallet Balance</div>
//  <div className="text-xl font-bold">₹{data.walletBalance.toFixed(2)}
//  </div>
//  </div>
//  <div className="bg-white p-4 rounded shadow">

//  <div className="text-sm text-gray-500">Total Invested</div>
//  <div className="text-xl font-bold">₹{data.totalInvested.toFixed(2)}
//  </div>
//  </div>
//  </div>
//  <div className="bg-white p-4 rounded shadow">
//  <div className="text-sm text-gray-500">Current Value</div>
//  <div className="text-xl font-bold">₹{data.currentValue.toFixed(2)}
//  </div>
//  </div>
//  <h2 className="text-xl mb-2">Holdings</h2>
//  <div className="space-y-3">
//  {data.holdings.length === 0 && <div>No holdings yet.</div>}
//  {data.holdings.map(h => (
//  <div key={h.product._id} className="bg-white p-4 rounded shadow 
// flex justify-between">
//  <div>
//  <div className="font-semibold">{h.product.name}</div>
//  <div className="text-sm text-gray-600">Units: {h.units}</div>
//  </div>
//  <div>
//  <div>Invested: ₹{h.invested.toFixed(2)}</div>
//  <div>Now: ₹{h.currentValue.toFixed(2)}</div>
//  </div>
//  </div>
//  ))}
//  </div>
//  </div>
//  );
//  }
// frontend/src/pages/Portfolio.jsx  
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Portfolio() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    api.get('/users/portfolio')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fin-blue-600"></div>
    </div>
  );

  const returnsPercentage = data.totalInvested > 0 
    ? ((data.returns / data.totalInvested) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-fin-gray-900 font-finance">Portfolio Overview</h1>
        <p className="text-fin-gray-600 mt-1">Track your investments and returns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-fin-blue-50 to-fin-blue-100 p-6 rounded-xl border border-fin-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fin-blue-600 text-sm font-medium">Wallet Balance</p>
              <p className="text-2xl font-bold text-fin-blue-900 mt-1">
                ₹{data.walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-fin-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-fin-green-50 to-fin-green-100 p-6 rounded-xl border border-fin-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fin-green-600 text-sm font-medium">Total Invested</p>
              <p className="text-2xl font-bold text-fin-green-900 mt-1">
                ₹{data.totalInvested.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-fin-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Current Value</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                ₹{data.currentValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br p-6 rounded-xl border ${
          data.returns >= 0 
            ? 'from-fin-green-50 to-fin-green-100 border-fin-green-200' 
            : 'from-fin-red-50 to-fin-red-100 border-fin-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                data.returns >= 0 ? 'text-fin-green-600' : 'text-fin-red-600'
              }`}>
                Total Returns
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                data.returns >= 0 ? 'text-fin-green-900' : 'text-fin-red-900'
              }`}>
                {data.returns >= 0 ? '+' : ''}₹{data.returns.toLocaleString()}
              </p>
              <p className={`text-sm mt-1 ${
                data.returns >= 0 ? 'text-fin-green-600' : 'text-fin-red-600'
              }`}>
                {returnsPercentage >= 0 ? '+' : ''}{returnsPercentage.toFixed(2)}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              data.returns >= 0 ? 'bg-fin-green-500' : 'bg-fin-red-500'
            }`}>
              <span className="text-white text-xl">{data.returns >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-white rounded-xl shadow-sm border border-fin-gray-100">
        <div className="p-6 border-b border-fin-gray-100">
          <h2 className="text-xl font-bold text-fin-gray-900">Your Holdings</h2>
        </div>
        
        {data.holdings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-fin-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-fin-gray-400 text-2xl">📊</span>
            </div>
            <p className="text-fin-gray-500">No investments yet. Start investing to build your portfolio!</p>
          </div>
        ) : (
          <div className="divide-y divide-fin-gray-100">
            {data.holdings.map((h, i) => {
              const holdingReturn = h.currentValue - h.invested;
              const holdingReturnPercent = (holdingReturn / h.invested) * 100;
              
              return (
                <div key={i} className="p-6 hover:bg-fin-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        h.product.category === 'Stock' ? 'bg-fin-blue-100' : 'bg-fin-green-100'
                      }`}>
                        <span className="text-xl">
                          {h.product.category === 'Stock' ? '📈' : '💼'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-fin-gray-900">{h.product.name}</h3>
                        <p className="text-sm text-fin-gray-500">{h.units} units • {h.product.category}</p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold text-fin-gray-900">
                        ₹{h.currentValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-fin-gray-500">
                        Invested: ₹{h.invested.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        holdingReturn >= 0 ? 'text-fin-green-600' : 'text-fin-red-600'
                      }`}>
                        {holdingReturn >= 0 ? '+' : ''}₹{holdingReturn.toLocaleString()} ({holdingReturnPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
