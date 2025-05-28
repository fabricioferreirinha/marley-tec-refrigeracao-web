
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  description: string;
  image: string;
  createdAt: string;
}

const Classifieds = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const whatsappNumber = "5521999999999";

  useEffect(() => {
    const savedProducts = localStorage.getItem('classifieds_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Produtos iniciais se não houver dados salvos
      const initialProducts: Product[] = [
        {
          id: '1',
          name: 'Geladeira Brastemp 420L',
          price: 800,
          condition: 'Seminova',
          description: 'Geladeira duplex, funcionando perfeitamente. Pequeno risco na porta.',
          image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Máquina de Lavar Consul 11kg',
          price: 600,
          condition: 'Usada',
          description: 'Máquina automática, todas as funções funcionando. Uso doméstico.',
          image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
          createdAt: '2024-01-10'
        },
        {
          id: '3',
          name: 'Freezer Horizontal 300L',
          price: 1200,
          condition: 'Excelente',
          description: 'Freezer horizontal, ideal para comércio. Revisado recentemente.',
          image: 'https://images.unsplash.com/photo-1586486488351-935b8b2b0c5d?w=400',
          createdAt: '2024-01-08'
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem('classifieds_products', JSON.stringify(initialProducts));
    }
  }, []);

  const handleWhatsAppContact = (product: Product) => {
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price}. Poderia me dar mais informações?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (products.length === 0) {
    return (
      <section id="classificados" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Eletrodomésticos Usados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Equipamentos revisados e testados, com garantia de funcionamento
            </p>
            <p className="text-gray-500">Em breve teremos produtos disponíveis.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="classificados" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Eletrodomésticos Usados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Equipamentos revisados e testados, com garantia de funcionamento
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.condition === 'Excelente' ? 'bg-green-100 text-green-800' :
                    product.condition === 'Seminova' ? 'bg-blue-100 text-blue-800' :
                    product.condition === 'Usada' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.condition}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {product.price.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWhatsAppContact(product)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Tenho Interesse
                  </button>
                  
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-blue-600">
                      R$ {selectedProduct.price.toLocaleString('pt-BR')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.condition === 'Excelente' ? 'bg-green-100 text-green-800' :
                      selectedProduct.condition === 'Seminova' ? 'bg-blue-100 text-blue-800' :
                      selectedProduct.condition === 'Usada' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedProduct.condition}
                    </span>
                  </div>
                  
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  
                  <button
                    onClick={() => handleWhatsAppContact(selectedProduct)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold transition-colors"
                  >
                    Entrar em Contato pelo WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Classifieds;
