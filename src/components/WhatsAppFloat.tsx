
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const whatsappNumber = "5521999999999";
  const whatsappMessage = "Olá! Preciso de assistência técnica. Podem me ajudar?";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 lg:w-8 lg:h-8" />
    </button>
  );
};

export default WhatsAppFloat;
