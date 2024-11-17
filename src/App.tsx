import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { InvoiceManager } from './components/InvoiceManager';
import { FinanceManager } from './components/FinanceManager';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Clients':
        return <ClientList />;
      case 'Invoices':
        return <InvoiceManager />;
      case 'Finance':
        return <FinanceManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;