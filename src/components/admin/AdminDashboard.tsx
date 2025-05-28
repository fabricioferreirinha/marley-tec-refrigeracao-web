
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total de Produtos</h3>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Visualizações</h3>
          <p className="text-2xl font-bold text-green-600">256</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Contatos</h3>
          <p className="text-2xl font-bold text-yellow-600">12</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
