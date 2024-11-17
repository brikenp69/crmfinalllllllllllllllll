import React from 'react';
import { useCRMStore } from '../store/crmStore';
import { format } from 'date-fns';
import { BarChart, Wallet, Users, FileText } from 'lucide-react';

export function Dashboard() {
  const { clients, invoices, cashBalance, bankBalance } = useCRMStore();

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paid ? inv.amount : 0), 0);
  const pendingPayments = invoices.reduce((sum, inv) => sum + (!inv.paid ? inv.amount : 0), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Cash Balance</p>
              <p className="text-2xl font-bold">{cashBalance.toLocaleString()} LEK</p>
            </div>
            <Wallet className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Bank Balance</p>
              <p className="text-2xl font-bold">{bankBalance.toLocaleString()} LEK</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">{pendingPayments.toLocaleString()} LEK</p>
            </div>
            <FileText className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Client</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(-5).map(invoice => {
                  const client = clients.find(c => c.id === invoice.clientId);
                  return (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-2">{format(new Date(invoice.date), 'dd/MM/yyyy')}</td>
                      <td className="py-2">{client?.name}</td>
                      <td className="py-2">{invoice.amount.toLocaleString()} LEK</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${invoice.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {invoice.paid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} LEK</p>
            </div>
            <div>
              <p className="text-gray-500">Outstanding Amount</p>
              <p className="text-2xl font-bold text-red-600">{pendingPayments.toLocaleString()} LEK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}