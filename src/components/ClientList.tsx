import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function ClientList() {
  const { clients, addClient } = useCRMStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    monthlyFee: 0,
    balanceStartDate: format(new Date(), 'yyyy-MM-dd'),
    backlog: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClient);
    setShowAddModal(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      monthlyFee: 0,
      balanceStartDate: format(new Date(), 'yyyy-MM-dd'),
      backlog: 0
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backlog</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {client.email && <div>{client.email}</div>}
                    {client.phone && <div className="text-gray-500">{client.phone}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{client.monthlyFee.toLocaleString()} LEK</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(client.balanceStartDate), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.backlog.toLocaleString()} LEK</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Fee (LEK) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newClient.monthlyFee}
                    onChange={(e) => setNewClient({ ...newClient, monthlyFee: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Balance Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newClient.balanceStartDate}
                    onChange={(e) => setNewClient({ ...newClient, balanceStartDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Backlog Amount (LEK)</label>
                  <input
                    type="number"
                    min="0"
                    value={newClient.backlog}
                    onChange={(e) => setNewClient({ ...newClient, backlog: Number(e.target.value) })}
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
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}