import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

export function FinanceManager() {
  const { transactions, addTransaction, cashBalance, bankBalance } = useCRMStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'deposit' as const,
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    account: 'cash' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(newTransaction);
    setShowAddModal(false);
    setNewTransaction({
      type: 'deposit',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      account: 'cash'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Finance</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Cash Register Balance</h3>
          <p className="text-3xl font-bold text-green-600">{cashBalance.toLocaleString()} LEK</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Bank Account Balance</h3>
          <p className="text-3xl font-bold text-blue-600">{bankBalance.toLocaleString()} LEK</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`flex items-center ${
                    transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'withdrawal' ? (
                      <ArrowDownRight className="h-5 w-5 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 mr-1" />
                    )}
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.account}</td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <span className={transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    {transaction.amount.toLocaleString()} LEK
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type *</label>
                  <select
                    required
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'deposit' | 'withdrawal' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account *</label>
                  <select
                    required
                    value={newTransaction.account}
                    onChange={(e) => setNewTransaction({ ...newTransaction, account: e.target.value as 'cash' | 'bank' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="cash">Cash Register</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (LEK) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <input
                    type="text"
                    required
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}