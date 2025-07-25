import React, { useState } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminHeader from './admin/AdminHeader';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminMedia from './admin/AdminMedia';
import AdminContent from './admin/AdminContent';
import AdminClassifieds from './AdminClassifieds';
import AdminConfiguracoes from './AdminConfiguracoes';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex-1">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'products' && <AdminClassifieds />}
            {activeTab === 'media' && <AdminMedia />}
            {activeTab === 'content' && <AdminContent />}
            {activeTab === 'configuracoes' && <AdminConfiguracoes />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
