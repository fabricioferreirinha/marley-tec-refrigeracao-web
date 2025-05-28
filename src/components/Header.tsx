
import React, { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappNumber = "5521999999999"; // Substitua pelo número real
  const whatsappMessage = "Olá! Gostaria de solicitar um orçamento para serviços de refrigeração.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Marley-Tec</h1>
              <p className="text-sm text-gray-600">Refrigeração</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Início
            </a>
            <a href="#servicos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Serviços
            </a>
            <a href="#classificados" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Classificados
            </a>
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contato
            </a>
          </nav>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="hidden md:flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium">
                Início
              </a>
              <a href="#servicos" className="text-gray-700 hover:text-blue-600 font-medium">
                Serviços
              </a>
              <a href="#classificados" className="text-gray-700 hover:text-blue-600 font-medium">
                Classificados
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-medium">
                Sobre
              </a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium">
                Contato
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
