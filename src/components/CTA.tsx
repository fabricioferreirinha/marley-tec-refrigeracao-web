"use client"
import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-marley-blue to-marley-red">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🚨 Precisa de Ajuda com Seu Eletrodoméstico?
          </h2>
          <p className="text-xl mb-8">
            Não deixe seu equipamento parado! Entre em contato agora e receba um orçamento gratuito.
          </p>
          <Link
            href="https://wa.me/5521997496201"
            className="inline-flex items-center gap-2 bg-marley-green hover:bg-marley-green-dark text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6" />
            📱 Chamar Técnico Agora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA; 