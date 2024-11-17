import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Menu, Home, Users, FileText, CreditCard, LogOut } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Layout({ children, currentPage, setCurrentPage }: LayoutProps) {
  const logout = useAuthStore(state => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Clients', icon: Users },
    { name: 'Invoices', icon: FileText },
    { name: 'Finance', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg hidden lg:block">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Migena CRM</h1>
          </div>
          <nav className="flex-1 p-4">
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setCurrentPage(name)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg mb-2 ${
                  currentPage === name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Migena CRM</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="p-4 border-t">
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  setCurrentPage(name);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg mb-2 ${
                  currentPage === name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}