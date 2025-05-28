
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import ProductForm from './ProductForm';

interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  description: string;
  images: string[];
  createdAt: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    const savedProducts = localStorage.getItem('admin_products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      // Migrar produtos antigos que tinham apenas uma imagem
      const migratedProducts = parsedProducts.map((product: any) => ({
        ...product,
        images: product.images || (product.image ? [product.image] : [])
      }));
      setProducts(migratedProducts);
    } else {
      // Produtos iniciais se não houver dados salvos
      const initialProducts: Product[] = [
        {
          id: '1',
          name: 'Geladeira Brastemp 420L',
          price: 800,
          condition: 'Seminova',
          description: 'Geladeira duplex, funcionando perfeitamente. Pequeno risco na porta.',
          images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'],
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Máquina de Lavar Consul 11kg',
          price: 600,
          condition: 'Usada',
          description: 'Máquina automática, todas as funções funcionando. Uso doméstico.',
          images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400'],
          createdAt: '2024-01-10'
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
    }
  }, []);

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    let updatedProducts;
    
    if (editingProduct) {
      // Editando produto existente
      updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData }
          : p
      );
    } else {
      // Adicionando novo produto
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedProducts = [...products, newProduct];
    }
    
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    
    // Atualizar também os produtos na página principal
    localStorage.setItem('classifieds_products', JSON.stringify(updatedProducts));
    
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      localStorage.setItem('classifieds_products', JSON.stringify(updatedProducts));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(undefined);
        }}
      />
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Gerenciar Classificados</h2>
        <button 
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </button>
      </div>
      
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum produto cadastrado ainda.</p>
            <button 
              onClick={handleAddProduct}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Adicionar primeiro produto
            </button>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {product.images && product.images.length > 0 && (
                  <div className="relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    {product.images.length > 1 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {product.images.length}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-600">R$ {product.price.toLocaleString('pt-BR')} - {product.condition}</p>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      localStorage.setItem('classifieds_products', JSON.stringify(updatedProducts));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };
};

export default AdminProducts;
