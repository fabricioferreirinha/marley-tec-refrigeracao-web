
import React from 'react';
import { Phone, Shield, Clock, Star } from 'lucide-react';

const Hero = () => {
  const whatsappNumber = "5521999999999";
  const whatsappMessage = "Olá! Preciso de assistência técnica para meu eletrodoméstico.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <section id="inicio" className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Especialista em <span className="text-blue-600">Refrigeração</span> em Maricá-RJ
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conserto de geladeiras, instalação de ar-condicionado split, manutenção de freezers e máquinas de lavar. 
              Atendimento rápido e serviço de qualidade garantida.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="text-gray-700 font-medium">Garantia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <span className="text-gray-700 font-medium">Rapidez</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-blue-600" />
                <span className="text-gray-700 font-medium">Qualidade</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                <Phone className="w-6 h-6" />
                <span>Solicitar Orçamento</span>
              </button>
              <a
                href="#servicos"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Ver Serviços
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:text-right">
            <div className="inline-block bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-2xl">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">❄️</div>
                  <h3 className="text-2xl font-bold">Refrigeração</h3>
                  <p className="text-blue-100">Profissional</p>
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
