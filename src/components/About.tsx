
import React from 'react';
import { Award, Users, Clock, MapPin } from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      number: "15+",
      label: "Anos de Experiência"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "1000+",
      label: "Clientes Atendidos"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      number: "24h",
      label: "Atendimento de Emergência"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      number: "100%",
      label: "Cobertura Maricá"
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre a Marley-Tec Refrigeração
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Com mais de 15 anos de experiência no mercado de refrigeração, a Marley-Tec se consolidou 
              como referência em Maricá-RJ oferecendo serviços de qualidade e atendimento personalizado.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Nossa missão é garantir o funcionamento perfeito dos seus eletrodomésticos, oferecendo 
              soluções rápidas, eficientes e com garantia. Trabalhamos com as principais marcas do mercado 
              e utilizamos apenas peças originais.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Técnico certificado e experiente</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Atendimento rápido e confiável</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Garantia em todos os serviços</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Preços justos e transparentes</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            O que nossos clientes dizem
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Excelente profissional! Consertou minha geladeira rapidamente e com preço justo. 
                Super recomendo o trabalho da Marley-Tec."
              </p>
              <div className="font-medium text-gray-900">Maria Silva</div>
              <div className="text-sm text-gray-500">Itaipuaçu</div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Instalação do ar-condicionado impecável. Serviço de qualidade e pontualidade. 
                Já indiquei para vários amigos."
              </p>
              <div className="font-medium text-gray-900">João Santos</div>
              <div className="text-sm text-gray-500">Centro de Maricá</div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Atendimento excepcional! Resolveu o problema da minha máquina de lavar no mesmo dia. 
                Muito profissional e honesto."
              </p>
              <div className="font-medium text-gray-900">Ana Costa</div>
              <div className="text-sm text-gray-500">Araçatiba</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
