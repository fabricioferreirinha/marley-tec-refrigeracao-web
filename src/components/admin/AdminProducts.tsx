
import React from 'react';

const AdminProducts = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Gerenciar Classificados</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Adicionar Produto
        </button>
      </div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Geladeira Brastemp 420L</h3>
              <p className="text-gray-600">R$ 800 - Seminova</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Editar</button>
              <button className="text-red-600 hover:text-red-800">Excluir</button>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Máquina de Lavar Consul 11kg</h3>
              <p className="text-gray-600">R$ 600 - Usada</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Editar</button>
              <button className="text-red-600 hover:text-red-800">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
