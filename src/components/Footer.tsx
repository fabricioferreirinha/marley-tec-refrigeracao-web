import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Clock, Mail, Star, Snowflake, Wrench, Shield, Award } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    'Ar-Condicionado Split',
    'Geladeiras e Freezers',
    'Máquinas de Lavar',
    'Fogões e Microondas',
    'Câmaras Frigoríficas',
    'Manutenção Preventiva'
  ]

  const quickLinks = [
    { name: 'Início', href: '#' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Avaliações', href: '#reviews' },
    { name: 'Contato', href: '#contato' },
    { name: 'Orçamento Grátis', href: 'https://wa.me/5521997496201' },
  ]

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <Snowflake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Marley Tec</h3>
                  <p className="text-blue-400 font-medium">Técnico em Refrigeração</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Mais de 15 anos de experiência em conserto e instalação de equipamentos de refrigeração. 
                Seu técnico de confiança em Maricá-RJ.
              </p>

              {/* Credenciais */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-green-400">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Técnico Certificado</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Garantia em Todos os Serviços</span>
                </div>
                <div className="flex items-center space-x-3 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">5.0 (127 avaliações)</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-400" />
                Nossos Serviços
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href="https://wa.me/5521997496201"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-start group"
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 group-hover:bg-orange-400 transition-colors"></span>
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white">Links Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-white">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">WhatsApp</p>
                    <Link 
                      href="https://wa.me/5521997496201"
                      className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                    >
                      (21) 99749-6201
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Localização</p>
                    <p className="text-blue-400 font-semibold">Maricá-RJ e Região</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Horário</p>
                    <p className="text-orange-400 font-semibold">24h Emergência</p>
                    <p className="text-gray-400 text-sm">Seg-Dom: 7h às 22h</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="https://wa.me/5521997496201"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/25"
              >
                <Phone className="w-5 h-5 mr-2" />
                Chamar no WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400">
                © {currentYear} <span className="text-white font-semibold">Marley Tec</span>. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Técnico em Refrigeração • Maricá-RJ • CNPJ: XX.XXX.XXX/0001-XX
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-green-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Site Seguro</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Técnico Certificado</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">5.0 Estrelas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 -mx-4 px-4 py-4 mb-0">
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              🚨 <span className="animate-pulse">EMERGÊNCIA 24H</span> 🚨
            </p>
            <p className="text-red-100 text-sm">
              Seu eletrodoméstico parou? Chame agora: 
              <Link 
                href="https://wa.me/5521997496201" 
                className="text-white font-bold hover:text-yellow-300 transition-colors ml-1"
              >
                (21) 99749-6201
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
