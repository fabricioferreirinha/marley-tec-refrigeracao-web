
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
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">MT</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-blue-900">Marley-Tec</h1>
              <p className="text-xs lg:text-sm text-gray-600">Refrigeração</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base">
              Início
            </a>
            <a href="#servicos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base">
              Serviços
            </a>
            <a href="#classificados" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base">
              Classificados
            </a>
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base">
              Sobre
            </a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base">
              Contato
            </a>
          </nav>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="hidden md:flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
          >
            <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="hidden lg:inline">WhatsApp</span>
            <span className="lg:hidden">Contato</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio" 
                className="text-gray-700 hover:text-blue-600 font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="#servicos" 
                className="text-gray-700 hover:text-blue-600 font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a 
                href="#classificados" 
                className="text-gray-700 hover:text-blue-600 font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Classificados
              </a>
              <a 
                href="#sobre" 
                className="text-gray-700 hover:text-blue-600 font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="#contato" 
                className="text-gray-700 hover:text-blue-600 font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full text-base"
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
