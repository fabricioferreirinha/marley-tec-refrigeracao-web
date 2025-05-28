
import React from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = "5521999999999";
  const whatsappMessage = "Olá! Gostaria de mais informações sobre os serviços.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MT</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Marley-Tec Refrigeração</h3>
                <p className="text-gray-400">Especialista em refrigeração</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Mais de 15 anos oferecendo serviços de qualidade em refrigeração para 
              residências e comércios em Maricá-RJ e região.
            </p>
            
            {/* Google My Business Link */}
            <div className="mb-6">
              <a
                href="https://g.co/kgs/3p9v632"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span>Veja nossa avaliação no Google</span>
              </a>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Conserto de Geladeiras</li>
              <li>Ar-Condicionado Split</li>
              <li>Freezers e Câmaras</li>
              <li>Máquinas de Lavar</li>
              <li>Manutenção Preventiva</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(21) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contato@marley-tecrefrigeracao.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Maricá - RJ<br />e região</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Marley-Tec Refrigeração. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            Desenvolvido para oferecer os melhores serviços de refrigeração em Maricá-RJ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
