
import React from 'react';
import { Phone, Shield, Clock, Star } from 'lucide-react';

const Hero = () => {
  const whatsappNumber = "5521999999999";
  const whatsappMessage = "Olá! Preciso de assistência técnica para meu eletrodoméstico.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <section id="inicio" className="bg-gradient-to-br from-blue-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Especialista em <span className="text-blue-600">Refrigeração</span> em Maricá-RJ
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Conserto de geladeiras, instalação de ar-condicionado split, manutenção de freezers e máquinas de lavar. 
              Atendimento rápido e serviço de qualidade garantida.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">Garantia</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">Rapidez</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">Qualidade</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 sm:space-x-3 bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Solicitar Orçamento</span>
              </button>
              <a
                href="#servicos"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors"
              >
                Ver Serviços
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="inline-block bg-gradient-to-br from-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8 rounded-2xl">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">❄️</div>
                  <h3 className="text-xl sm:text-2xl font-bold">Refrigeração</h3>
                  <p className="text-blue-100 text-sm sm:text-base">Profissional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
