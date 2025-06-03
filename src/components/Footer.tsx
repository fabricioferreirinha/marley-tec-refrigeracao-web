'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock, Mail, Star, Wrench, Shield, Award } from 'lucide-react'

export default function Footer() {
  const [stats, setStats] = useState({
    mediaNotas: 5.0,
    totalReviews: 127
  })
  const [configuracoes, setConfiguracoes] = useState({
    telefone: '(21) 99749-6201',
    horario_funcionamento: 'Seg-Sex: 8h às 18h',
    horario_emergencia: 'Disponível 24h',
    cnpj: '37.481.212/0001-48',
    endereco: 'Maricá-RJ e Região',
    emergencia_24h: 'false'
  })
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchStats()
    fetchConfiguracoes()
  }, [])

  const fetchStats = async () => {
    try {
      // Primeiro tentar buscar estatísticas editáveis
      const statsResponse = await fetch('/api/reviews/stats')
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats({
          mediaNotas: statsData.mediaNotas || 5.0,
          totalReviews: statsData.quantidadeTotal || 127
        })
      } else {
        // Fallback para estatísticas da API de reviews
        const response = await fetch('/api/reviews?ativo=true&limit=1')
        const data = await response.json()
        
        if (response.ok && data.stats) {
          setStats({
            mediaNotas: data.stats.mediaNotas || 5.0,
            totalReviews: data.stats.totalReviews || 127
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch('/api/configuracoes')
      const data = await response.json()
      
      if (response.ok && data.configuracoes) {
        setConfiguracoes(prev => ({
          ...prev,
          ...data.configuracoes
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

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
    { name: 'Classificados', href: '/classificados' },
    { name: 'Contato', href: '#contato' },
    { name: 'Orçamento Grátis', href: `https://wa.me/55${configuracoes.telefone.replace(/\D/g, '')}` },
  ]

  const emergencia24h = configuracoes.emergencia_24h === 'true'
  const whatsappUrl = `https://wa.me/55${configuracoes.telefone.replace(/\D/g, '')}`

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
                <div className="w-16 h-16 rounded-xl flex items-center justify-center p-1">
                  <Image
                    src="/logo.svg"
                    alt="Marley Tec Logo"
                    width={60}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">MARLEY-TEC</h3>
                  <p className="text-blue-400 font-medium">Refrigeração</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Mais de 15 anos de experiência em conserto e instalação de equipamentos de refrigeração. 
                Seu técnico de confiança em {configuracoes.endereco}.
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
                  <span className="font-medium">
                    {loading ? '5.0 (127 avaliações)' : `${stats.mediaNotas.toFixed(1)} (${stats.totalReviews} avaliações)`}
                  </span>
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
                      href={whatsappUrl}
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
                      href={whatsappUrl}
                      className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                    >
                      {configuracoes.telefone}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Localização</p>
                    <p className="text-blue-400 font-semibold">{configuracoes.endereco}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Horário</p>
                    <p className="text-orange-400 font-semibold">{configuracoes.horario_funcionamento}</p>
                    {emergencia24h && (
                      <p className="text-gray-400 text-sm">{configuracoes.horario_emergencia}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={whatsappUrl}
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
                Técnico em Refrigeração • {configuracoes.endereco} • CNPJ: {configuracoes.cnpj}
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
                <span className="text-sm font-medium">
                  {loading ? '5.0 Estrelas' : `${stats.mediaNotas.toFixed(1)} Estrelas`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner - Só mostra se emergencia_24h estiver ativo */}
        {emergencia24h && (
          <div className="bg-gradient-to-r from-red-600 to-orange-600 -mx-4 px-4 py-4 mb-0">
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                🚨 <span className="animate-pulse">EMERGÊNCIA 24H</span> 🚨
              </p>
              <p className="text-red-100 text-sm">
                Seu eletrodoméstico parou? Chame agora: 
                <Link 
                  href={whatsappUrl} 
                  className="text-white font-bold hover:text-yellow-300 transition-colors ml-1"
                >
                  {configuracoes.telefone}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
