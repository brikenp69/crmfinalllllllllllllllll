import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { Plus, Download, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function InvoiceManager() {
  const { clients, invoices, addInvoice, generateMonthlyInvoices, markInvoiceAsPaid } = useCRMStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice(newInvoice);
    setShowAddModal(false);
    setNewInvoice({
      clientId: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const handlePayment = (paymentMethod: 'cash' | 'bank') => {
    if (selectedInvoice) {
      markInvoiceAsPaid(selectedInvoice, paymentMethod);
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    }
  };

  const generatePDF = (invoice: any) => {
    const client = clients.find(c => c.id === invoice.clientId);
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${format(new Date(invoice.date), 'dd/MM/yyyy')}`, 20, 40);
    doc.text(`Invoice #: ${invoice.id.slice(0, 8)}`, 20, 50);
    
    // Client details
    doc.text('Bill To:', 20, 70);
    doc.text(client?.name || '', 20, 80);
    if (client?.email) doc.text(client.email, 20, 90);
    if (client?.phone) doc.text(client.phone, 20, 100);
    
    // Invoice table
    autoTable(doc, {
      startY: 120,
      head: [['Description', 'Amount']],
      body: [
        ['Monthly Service Fee', `${invoice.amount.toLocaleString()} LEK`],
      ],
    });
    
    // Total
    doc.text(`Total Amount: ${invoice.amount.toLocaleString()} LEK`, 20, doc.lastAutoTable.finalY + 20);
    
    // Save PDF
    doc.save(`invoice-${invoice.id.slice(0, 8)}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <div className="space-x-3">
          <button
            onClick={generateMonthlyInvoices}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Generate Monthly Invoices
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => {
              const client = clients.find(c => c.id === invoice.clientId);
              return (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(invoice.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{client?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.amount.toLocaleString()} LEK</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => generatePDF(invoice)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    {!invoice.paid && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice.id);
                          setShowPaymentModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CreditCard className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Invoice</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client *</label>
                  <select
                    required
                    value={newInvoice.clientId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (LEK) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
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
                  Add Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => handlePayment('cash')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Cash Register
              </button>
              <button
                onClick={() => handlePayment('bank')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Bank Transfer
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}