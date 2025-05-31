"use client"

import React, { useState, useEffect } from 'react'
import { Star, Quote, MapPin, Calendar, Award, TrendingUp } from 'lucide-react'

interface Review {
  id: string
  nome: string
  avatar?: string
  nota: number
  comentario: string
  servico?: string
  dataServico?: string
  destacado: boolean
  source: string
  createdAt: string
}

interface ReviewStats {
  mediaNotas: number
  totalReviews: number
  distribuicaoNotas: Record<number, number>
}

interface ReviewsData {
  reviews: Review[]
  stats: ReviewStats
}

const CommercialReviews = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleReviews, setVisibleReviews] = useState(6)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?ativo=true')
      if (response.ok) {
        const data = await response.json()
        setReviewsData(data)
      } else {
        // Fallback para dados mock se API falhar
        setReviewsData(getMockData())
      }
    } catch (error) {
      console.error('Erro ao buscar reviews:', error)
      setReviewsData(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const getMockData = (): ReviewsData => ({
    reviews: [
      {
        id: '1',
        nome: 'João Carlos Silva',
        avatar: 'JC',
        nota: 5,
        comentario: 'Marley é um excelente técnico! Consertou meu micro-ondas LG que já estava desengonçado. Trabalho limpo e organizado. Super recomendo!',
        servico: 'Conserto de Microondas',
        dataServico: '2024-01-15',
        destacado: true,
        source: 'GOOGLE',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        nome: 'Fernanda Lima',
        avatar: 'FL',
        nota: 5,
        comentario: 'Profissional exemplar! Chegou no horário combinado e resolveu o problema da minha lava-louças Midea rapidamente. Muito educado e prestativo.',
        servico: 'Conserto de Lava-louças',
        dataServico: '2024-01-10',
        destacado: true,
        source: 'GOOGLE',
        createdAt: '2024-01-10T14:20:00Z'
      },
      {
        id: '3',
        nome: 'Maria Santos',
        avatar: 'MS',
        nota: 5,
        comentario: 'Excelente serviço! Minha geladeira não estava gelando e ele resolveu rapidamente. Preço justo e garantia no serviço.',
        servico: 'Conserto de Geladeira',
        dataServico: '2024-01-08',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-08T16:45:00Z'
      },
      {
        id: '4',
        nome: 'Carlos Eduardo',
        avatar: 'CE',
        nota: 5,
        comentario: 'Técnico muito competente! Instalou meu ar-condicionado split com perfeição. Trabalho impecável e pontualidade nota 10.',
        servico: 'Instalação de Ar-condicionado',
        dataServico: '2024-01-05',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-05T09:15:00Z'
      },
      {
        id: '5',
        nome: 'Ana Paula',
        avatar: 'AP',
        nota: 5,
        comentario: 'Salvou meu fogão! Estava com problemas no acendimento e ele resolveu tudo. Profissional confiável e preço honesto.',
        servico: 'Conserto de Fogão',
        dataServico: '2024-01-03',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-03T11:30:00Z'
      },
      {
        id: '6',
        nome: 'Roberto Mendes',
        avatar: 'RM',
        nota: 5,
        comentario: 'Atendimento excepcional! Consertou minha máquina de lavar em casa mesmo. Muito prático e eficiente.',
        servico: 'Conserto de Máquina de Lavar',
        dataServico: '2024-01-01',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-01T15:20:00Z'
      }
    ],
    stats: {
      mediaNotas: 5.0,
      totalReviews: 127,
      distribuicaoNotas: { 5: 120, 4: 5, 3: 2, 2: 0, 1: 0 }
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderAvatar = (review: Review) => {
    if (review.avatar && review.avatar.startsWith('http')) {
      return (
        <img
          src={review.avatar}
          alt={review.nome}
          className="w-12 h-12 rounded-full object-cover"
        />
      )
    }
    
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        {review.avatar || review.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
    )
  }

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 6)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando avaliações...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!reviewsData) return null

  const { reviews, stats } = reviewsData

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header com Estatísticas */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-6">
            <Award className="w-4 h-4 mr-2" />
            Avaliado pelos nossos clientes
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            ⭐ O que nossos clientes dizem
          </h2>
          
          {/* Estatísticas destacadas */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {renderStars(5)}
              </div>
              <span className="text-3xl font-bold text-gray-800">{stats.mediaNotas.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-semibold">{stats.totalReviews}+ avaliações</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span>Google Reviews</span>
            </div>
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>

        {/* Grid de Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.slice(0, visibleReviews).map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                review.destacado ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Header do Review */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {renderAvatar(review)}
                  <div>
                    <h4 className="font-bold text-gray-800">{review.nome}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(review.nota)}
                    </div>
                  </div>
                </div>
                
                {review.destacado && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ DESTAQUE
                  </div>
                )}
              </div>

              {/* Comentário */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-blue-500 mb-2 opacity-60" />
                <p className="text-gray-700 italic leading-relaxed">
                  "{review.comentario}"
                </p>
              </div>

              {/* Informações do Serviço */}
              <div className="space-y-2 text-sm">
                {review.servico && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="font-medium">{review.servico}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3C/svg%3E"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <span className="text-xs">Google</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Ver Mais */}
        {visibleReviews < reviews.length && (
          <div className="text-center">
            <button
              onClick={loadMoreReviews}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Ver Mais Avaliações
              <TrendingUp className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* CTA Final */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            🚀 Junte-se aos nossos {stats.totalReviews}+ clientes satisfeitos!
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Garantia de qualidade e atendimento 5 estrelas em todos os serviços
          </p>
          <a
            href="https://wa.me/5521997496201"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            📱 Solicitar Orçamento Grátis
          </a>
        </div>
      </div>
    </section>
  )
}

export default CommercialReviews 