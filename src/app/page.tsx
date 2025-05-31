"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReviewsCarousel from '@/components/ReviewsCarousel'
import Footer from '@/components/Footer'
import { ArrowRight, Star, Shield, Clock, MapPin, Phone, CheckCircle, Snowflake, Zap, Wrench, Award } from 'lucide-react'

// Componentes de ícones personalizados para eletrodomésticos
const AirConditionerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="16" width="56" height="32" rx="4" fill="currentColor" opacity="0.1"/>
    <rect x="4" y="16" width="56" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 24h40M12 32h40M12 40h40" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="52" cy="24" r="2" fill="currentColor"/>
    <path d="M16 8v8M24 8v8M32 8v8M40 8v8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const RefrigeratorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="4" width="40" height="56" rx="4" fill="currentColor" opacity="0.1"/>
    <rect x="12" y="4" width="40" height="56" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 24h40" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="18" cy="34" r="1.5" fill="currentColor"/>
    <rect x="20" y="12" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="20" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const WashingMachineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="48" height="48" rx="6" fill="currentColor" opacity="0.1"/>
    <rect x="8" y="8" width="48" height="48" rx="6" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="36" r="16" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="36" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.3"/>
    <circle cx="46" cy="18" r="3" fill="currentColor" opacity="0.3"/>
    <path d="M28 32l8 8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const StoveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="48" height="40" rx="4" fill="currentColor" opacity="0.1"/>
    <rect x="8" y="16" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="28" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="44" cy="28" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="28" r="2" fill="currentColor"/>
    <circle cx="44" cy="28" r="2" fill="currentColor"/>
    <rect x="12" y="40" width="40" height="12" rx="2" fill="currentColor" opacity="0.2"/>
    <path d="M16 44h32M16 48h32" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

export default function HomePage() {
  return (
    <>
      {/* Header/Navegação */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1">
                <Image
                  src="/logo.svg"
                  alt="Marley Tec Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-wider">MARLEY-TEC</h1>
                <p className="text-sm text-blue-600 font-medium tracking-widest">REFRIGERAÇÃO</p>
              </div>
            </div>
            
            {/* Contato Header */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Maricá-RJ</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">24h Emergência</span>
              </div>
              <Link
                href="https://wa.me/5521997496201"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>(21) 99749-6201</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section Redesigned */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-500 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 py-0 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Conteúdo Principal */}
              <div className="space-y-3 lg:pr-8 pt-12 pb-4">
                
                {/* Título Principal */}
              <div className="space-y-3">
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                    <span className="text-gray-900">Seu</span>{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Técnico</span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Especialista</span>
                  <br />
                    <span className="text-gray-700 text-4xl lg:text-5xl">em Refrigeração</span>
                </h1>
                
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    <strong className="text-gray-800">Mais de 15 anos de experiência</strong> em conserto e instalação de 
                  ar-condicionado split, geladeiras, fogões, máquinas de lavar, microondas, freezers e câmaras frigoríficas.
                </p>
                
                  <div className="flex items-center space-x-4 text-lg">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Garantia em Todos os Serviços</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">Atende Maricá-RJ</span>
                    </div>
                  </div>
              </div>

                {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="https://wa.me/5521997496201"
                      className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                  >
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>🚀 Orçamento GRÁTIS</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="#servicos"
                      className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                      <Wrench className="w-5 h-5" />
                      <span>Ver Serviços</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                </div>
              </div>

              {/* Imagem do Técnico */}
              <div className="relative flex justify-center mb-0">
                <div className="relative w-full max-w-xl">
                  {/* Container principal do técnico */}
                  <div className="relative z-30 flex justify-center">
                    <div className="relative">
                {/* Imagem do técnico */}
                      <div className="relative flex justify-center">
                  <Image
                          src="/tecnico.webp"
                          alt="Marley Tec - Técnico Especialista em Refrigeração Maricá-RJ"
                          width={401}
                          height={481}
                    priority
                          className="w-full h-auto max-w-lg object-contain drop-shadow-2xl relative z-30 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Badges flutuantes externos - clean */}
                      <div className="absolute top-16 -right-10 bg-green-500 text-white px-4 py-2 rounded-full shadow-xl z-40 border-2 border-white">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span className="text-sm font-bold">Certificado</span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-12 -left-10 bg-red-500 text-white px-4 py-2 rounded-xl shadow-xl z-40 border-2 border-white transform -rotate-12">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-bold">24h Emergência</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/3 -left-8 bg-orange-500 text-white px-3 py-2 rounded-xl shadow-xl z-40 border-2 border-white transform rotate-6">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-bold">Maricá-RJ</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Barra de Estatísticas - Conectada com a imagem do técnico */}
        <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative">
          {/* Sutil background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              
              {/* 15+ Anos */}
              <div className="group">
                <div className="text-4xl lg:text-5xl font-black text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  15+
                </div>
                <div className="text-white font-semibold">Anos de Experiência</div>
              </div>

              {/* 1.5K+ Famílias */}
              <div className="group">
                <div className="text-4xl lg:text-5xl font-black text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  1.5K+
                </div>
                <div className="text-white font-semibold">Famílias Satisfeitas</div>
              </div>

              {/* 4K+ Equipamentos */}
              <div className="group">
                <div className="text-4xl lg:text-5xl font-black text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  4K+
                </div>
                <div className="text-white font-semibold">Equipamentos Reparados</div>
            </div>

              {/* 24h Disponível */}
              <div className="group">
                <div className="text-4xl lg:text-5xl font-black text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  24h
            </div>
                <div className="text-white font-semibold">Sempre Disponível</div>
            </div>
              
            </div>
            
            {/* Linha decorativa no centro */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-px bg-orange-300/30 flex-1 max-w-xs"></div>
              <div className="mx-6 text-orange-300 font-semibold">Números que Impressionam</div>
              <div className="h-px bg-orange-300/30 flex-1 max-w-xs"></div>
          </div>
        </div>
      </section>

        {/* Seção de Serviços Redesigned */}
        <section id="servicos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-semibold mb-6">
                <Wrench className="w-5 h-5 mr-2" />
                Serviços Especializados
              </div>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
                Soluções Completas em{' '}
                <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Refrigeração
                </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Especialista certificado oferece <strong>diagnóstico gratuito</strong> e 
                <strong className="text-orange-600"> garantia em todos os serviços</strong> para 
                residências e comércios em Maricá-RJ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Ar-Condicionado */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-t-4 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <AirConditionerIcon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Ar-Condicionado Split</h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Instalação profissional</strong> com garantia</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Limpeza técnica completa</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Não gelando? Resolvemos!</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Manutenção preventiva</span>
                </li>
              </ul>
                  <Link 
                    href="https://wa.me/5521997496201"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
            </div>

              {/* Geladeiras */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-t-4 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <RefrigeratorIcon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Geladeiras & Freezers</h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Não gela?</strong> Diagnóstico completo</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Recarga de gás ecológico</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Troca de compressor</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Câmaras frigoríficas</span>
                </li>
              </ul>
                  <Link 
                    href="https://wa.me/5521997496201"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
            </div>

              {/* Máquinas de Lavar */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-t-4 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <WashingMachineIcon className="w-10 h-10 text-blue-600" />
                  </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Máquinas de Lavar</h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Não liga ou não lava?</strong></span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Vazamentos e problemas elétricos</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Troca de peças originais</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Revisão completa</span>
                </li>
              </ul>
                  <Link 
                    href="https://wa.me/5521997496201"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
            </div>

              {/* Fogões & Microondas */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-t-4 border-orange-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <StoveIcon className="w-10 h-10 text-orange-600" />
                  </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Fogões & Microondas</h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Acendimento e regulagem</strong></span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Microondas não aquece?</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Limpeza técnica interna</span>
                </li>
                <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Segurança garantida</span>
                </li>
              </ul>
                  <Link 
                    href="https://wa.me/5521997496201"
                    className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-800 transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Central */}
            <div className="mt-20">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 p-12 lg:p-16 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl lg:text-5xl font-black mb-6">
                    🚨 Seu Eletrodoméstico Parou?
                  </h3>
                  <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                    <strong>Não entre em pânico!</strong> Nosso técnico especialista resolve rapidamente. 
                    <span className="text-yellow-300"> Diagnóstico GRATUITO</span> e garantia total.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      href="https://wa.me/5521997496201"
                      className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                    >
                      <Phone className="w-6 h-6" />
                      <span>📱 Chamar Técnico AGORA</span>
                    </Link>
                    <Link
                      href="#reviews"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/30 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Star className="w-6 h-6" />
                      <span>Ver Avaliações (127)</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-20">
          <ReviewsCarousel />
        </section>

        {/* Seção de Contato Final */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-green-500/20 text-green-400 rounded-full font-semibold mb-8">
                <Phone className="w-5 h-5 mr-2" />
                Pronto para Te Atender
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-black mb-6">
                Precisa de um <span className="text-green-400">Técnico Agora?</span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
                Atendimento <strong className="text-white">24 horas</strong> em Maricá-RJ. 
                <span className="text-green-400"> Diagnóstico gratuito</span> e 
                <span className="text-blue-400"> garantia em todos os serviços</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                  <p className="text-gray-400">(21) 99749-6201</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Localização</h3>
                  <p className="text-gray-400">Maricá-RJ e Região</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Horário</h3>
                  <p className="text-gray-400">24h Emergência</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="https://wa.me/5521997496201"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>Chamar no WhatsApp</span>
                </Link>
                <a
                  href="tel:21997496201"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Phone className="w-6 h-6" />
                  <span>Ligar Direto</span>
                </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* WhatsApp Float Button */}
            <Link
              href="https://wa.me/5521997496201"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-110 group"
        aria-label="Contato via WhatsApp"
            >
        <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-12 -left-20 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chame no WhatsApp
        </span>
            </Link>

      {/* Footer */}
      <Footer />
    </>
  )
} 