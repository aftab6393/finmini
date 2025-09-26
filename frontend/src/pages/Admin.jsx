import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
    api.get('/admin/transactions').then(res => setTransactions(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Users */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Wallet Balance</th>
                <th className="border border-gray-300 p-2">PAN</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">₹{user.walletBalance?.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">{user.pan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Transactions ({transactions.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2">User</th>
                <th className="border border-gray-300 p-2">Product</th>
                <th className="border border-gray-300 p-2">Units</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn._id}>
                  <td className="border border-gray-300 p-2">{txn.user?.name}</td>
                  <td className="border border-gray-300 p-2">{txn.product?.name}</td>
                  <td className="border border-gray-300 p-2">{txn.units}</td>
                  <td className="border border-gray-300 p-2">₹{txn.amount?.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">{new Date(txn.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
