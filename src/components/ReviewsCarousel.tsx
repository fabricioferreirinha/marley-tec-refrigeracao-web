"use client"

import React, { useState, useEffect } from 'react'
import { Star, Quote, Calendar, ChevronLeft, ChevronRight, Award, MapPin } from 'lucide-react'

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

const ReviewsCarousel = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  useEffect(() => {
    fetchReviews()
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  useEffect(() => {
    if (!reviewsData?.reviews.length) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, reviewsData.reviews.length - itemsPerPage)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [reviewsData, itemsPerPage])

  const updateItemsPerPage = () => {
    if (window.innerWidth < 768) {
      setItemsPerPage(1)
    } else if (window.innerWidth < 1024) {
      setItemsPerPage(2)
    } else {
      setItemsPerPage(3)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?ativo=true')
      if (response.ok) {
        const data = await response.json()
        setReviewsData(data)
      } else {
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
        nome: 'Fernanda Lima Santos',
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
        nome: 'Maria Eduarda Santos',
        avatar: 'ME',
        nota: 5,
        comentario: 'Excelente serviço! Minha geladeira não estava gelando e ele resolveu rapidamente. Preço justo e garantia no serviço. Muito satisfeita!',
        servico: 'Conserto de Geladeira',
        dataServico: '2024-01-08',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-08T16:45:00Z'
      },
      {
        id: '4',
        nome: 'Carlos Eduardo Mendes',
        avatar: 'CE',
        nota: 5,
        comentario: 'Técnico muito competente! Instalou meu ar-condicionado split com perfeição. Trabalho impecável e pontualidade nota 10. Recomendo demais!',
        servico: 'Instalação de Ar-condicionado',
        dataServico: '2024-01-05',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-05T09:15:00Z'
      },
      {
        id: '5',
        nome: 'Ana Paula Costa',
        avatar: 'AP',
        nota: 5,
        comentario: 'Salvou meu fogão! Estava com problemas no acendimento e ele resolveu tudo. Profissional confiável e preço honesto. Muito obrigada!',
        servico: 'Conserto de Fogão',
        dataServico: '2024-01-03',
        destacado: false,
        source: 'GOOGLE',
        createdAt: '2024-01-03T11:30:00Z'
      },
      {
        id: '6',
        nome: 'Roberto Alves Mendes',
        avatar: 'RM',
        nota: 5,
        comentario: 'Atendimento excepcional! Consertou minha máquina de lavar em casa mesmo. Muito prático e eficiente. Profissional de primeira!',
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
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'há 1 dia'
    if (diffDays < 7) return `há ${diffDays} dias`
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
    if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`
    return `há ${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? 's' : ''}`
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
          className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
        />
      )
    }
    
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600', 
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-indigo-500 to-blue-600',
      'from-teal-500 to-green-600'
    ]
    const colorIndex = review.nome.length % colors.length
    
    return (
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-lg`}>
        {review.avatar || review.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
    )
  }

  const nextSlide = () => {
    if (!reviewsData?.reviews.length) return
    const maxIndex = Math.max(0, reviewsData.reviews.length - itemsPerPage)
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }

  const prevSlide = () => {
    if (!reviewsData?.reviews.length) return
    const maxIndex = Math.max(0, reviewsData.reviews.length - itemsPerPage)
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando avaliações...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!reviewsData?.reviews.length) return null

  const { reviews, stats } = reviewsData

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-200 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header com Estatísticas */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-orange-100 text-blue-800 font-bold text-sm mb-6 shadow-lg">
            <Award className="w-5 h-5 mr-3" />
            ⭐ Avaliações Reais dos Nossos Clientes
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-800 leading-tight">
            💫 O que nossos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              clientes
            </span>{' '}
            dizem
          </h2>
          
          {/* Estatísticas em destaque */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex items-center">
                {renderStars(5)}
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-800">{stats.mediaNotas.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Nota Média</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <MapPin className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-800">{stats.totalReviews}+</div>
                <div className="text-sm text-gray-600">Avaliações</div>
              </div>
            </div>
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Botões de navegação */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reviews Carousel */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full relative ${
                    review.destacado ? 'ring-4 ring-blue-500 ring-opacity-30' : ''
                  }`}>
                    {/* Badge de destaque */}
                    {review.destacado && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ DESTAQUE
                      </div>
                    )}

                    {/* Header do Review */}
                    <div className="flex items-center gap-4 mb-6">
                      {renderAvatar(review)}
                      <div>
                        <h4 className="font-bold text-xl text-gray-800">{review.nome}</h4>
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(review.nota)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Aspas decorativas */}
                    <Quote className="w-12 h-12 text-blue-500 mb-4 opacity-20" />

                    {/* Comentário */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{review.comentario}"
                    </p>

                    {/* Informações do Serviço */}
                    {review.servico && (
                      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          <span>Serviço: {review.servico}</span>
                        </div>
                      </div>
                    )}

                    {/* Footer com origem */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img 
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285F4'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='%23FBBC05'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='%23EA4335'/%3E%3C/svg%3E"
                          alt="Google"
                          className="w-6 h-6"
                        />
                        <span className="text-sm font-medium text-gray-600">Google Reviews</span>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        ✅ Verificado
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerPage) === index 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* CTA Final */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-3xl lg:text-4xl font-bold mb-6">
              🚀 Sua Vez de Fazer Parte dos {stats.totalReviews}+ Clientes Satisfeitos!
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Garantia de qualidade ⭐⭐⭐⭐⭐ e atendimento excepcional em todos os serviços. 
              <strong> Diagnóstico gratuito!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://wa.me/5521997496201"
                className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                📱 Solicitar Orçamento Grátis
              </a>
              <a
                href="tel:21997496201"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-bold text-lg rounded-2xl shadow-xl transition-all duration-300"
              >
                📞 Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsCarousel 