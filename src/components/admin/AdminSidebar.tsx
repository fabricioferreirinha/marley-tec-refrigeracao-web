
import React from 'react';
import { Settings, Users, Package } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-white shadow rounded-lg mr-6">
      <nav className="mt-5 px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className="mr-4 h-6 w-6" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="mr-4 h-6 w-6" />
          Classificados
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeTab === 'content' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="mr-4 h-6 w-6" />
          Conteúdo
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
