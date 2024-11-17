import { create } from 'zustand';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  monthlyFee: number;
  balanceStartDate: string;
  backlog: number;
}

interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  paid: boolean;
  paymentMethod?: 'cash' | 'bank';
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  date: string;
  description: string;
  account: 'cash' | 'bank';
}

interface CRMState {
  clients: Client[];
  invoices: Invoice[];
  transactions: Transaction[];
  cashBalance: number;
  bankBalance: number;
  addClient: (client: Omit<Client, 'id'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  generateMonthlyInvoices: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  markInvoiceAsPaid: (invoiceId: string, paymentMethod: 'cash' | 'bank') => void;
}

export const useCRMStore = create<CRMState>((set) => ({
  clients: [],
  invoices: [],
  transactions: [],
  cashBalance: 0,
  bankBalance: 0,

  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: crypto.randomUUID() }]
  })),

  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, { ...invoice, id: crypto.randomUUID() }]
  })),

  generateMonthlyInvoices: () => set((state) => {
    const today = new Date();
    const newInvoices = state.clients.map(client => ({
      id: crypto.randomUUID(),
      clientId: client.id,
      amount: client.monthlyFee,
      date: format(today, 'yyyy-MM-dd'),
      paid: false
    }));
    return { invoices: [...state.invoices, ...newInvoices] };
  }),

  addTransaction: (transaction) => set((state) => {
    const amount = transaction.type === 'withdrawal' ? -transaction.amount : transaction.amount;
    const newBalance = transaction.account === 'cash' 
      ? state.cashBalance + amount
      : state.bankBalance + amount;

    if (transaction.account === 'cash') {
      return {
        transactions: [...state.transactions, { ...transaction, id: crypto.randomUUID() }],
        cashBalance: newBalance
      };
    } else {
      return {
        transactions: [...state.transactions, { ...transaction, id: crypto.randomUUID() }],
        bankBalance: newBalance
      };
    }
  }),

  markInvoiceAsPaid: (invoiceId, paymentMethod) => set((state) => {
    const invoice = state.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return state;

    const updatedInvoices = state.invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, paid: true, paymentMethod } : inv
    );

    const newTransaction = {
      id: crypto.randomUUID(),
      type: 'payment' as const,
      amount: invoice.amount,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: `Payment for invoice #${invoiceId}`,
      account: paymentMethod
    };

    const newBalance = paymentMethod === 'cash'
      ? state.cashBalance + invoice.amount
      : state.bankBalance + invoice.amount;

    return {
      invoices: updatedInvoices,
      transactions: [...state.transactions, newTransaction],
      ...(paymentMethod === 'cash' ? { cashBalance: newBalance } : { bankBalance: newBalance })
    };
  })
}));