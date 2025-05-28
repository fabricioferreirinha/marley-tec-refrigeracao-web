
import React from 'react';
import { Snowflake, Wind, Zap, Wrench } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Snowflake className="w-12 h-12 text-blue-600" />,
      title: "Conserto de Geladeiras",
      description: "Reparo completo de geladeiras de todas as marcas. Diagnóstico gratuito e peças originais.",
      features: ["Brastemp", "Consul", "Electrolux", "Samsung", "LG"]
    },
    {
      icon: <Wind className="w-12 h-12 text-blue-600" />,
      title: "Ar-Condicionado Split",
      description: "Instalação, manutenção e reparo de sistemas de ar-condicionado split residencial e comercial.",
      features: ["Instalação", "Manutenção", "Limpeza", "Recarga de gás"]
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: "Freezers e Câmaras",
      description: "Manutenção especializada em freezers verticais, horizontais e câmaras frigoríficas comerciais.",
      features: ["Freezers verticais", "Freezers horizontais", "Câmaras comerciais", "Balcões refrigerados"]
    },
    {
      icon: <Wrench className="w-12 h-12 text-blue-600" />,
      title: "Máquinas de Lavar",
      description: "Conserto e manutenção de máquinas de lavar roupas de todas as marcas e modelos.",
      features: ["Automáticas", "Semi-automáticas", "Lava e seca", "Tanquinho"]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas em refrigeração para residências e comércios em Maricá e região
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="#contato"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Solicitar Atendimento
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
