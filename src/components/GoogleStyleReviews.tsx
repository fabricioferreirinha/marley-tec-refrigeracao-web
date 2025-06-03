"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  nome: string
  avatar?: string
  avatarColor?: string
  avatarInitials?: string
  nota: number
  comentario: string
  tempoRelativo: string
  source: string
}

interface GoogleStyleReviewsProps {
  showHeader?: boolean
  maxReviews?: number
  className?: string
}

const GoogleStyleReviews = ({ 
  showHeader = true, 
  maxReviews = 12,
  className = ""
}: GoogleStyleReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    mediaNotas: 0,
    totalReviews: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Configurações do carousel - garantindo 3 por vez
  const itemsPerView = 3
  const autoPlayInterval = 6000 // 6 segundos

  useEffect(() => {
    fetchReviews()
  }, [])

  // Auto-play do carousel com pausa suave
  useEffect(() => {
    if (reviews.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + itemsPerView
        return nextIndex >= reviews.length ? 0 : nextIndex
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [reviews.length, itemsPerView])

  const fetchReviews = async () => {
    try {
      // Buscar reviews e estatísticas editáveis em paralelo
      const [reviewsResponse, statsResponse] = await Promise.all([
        fetch(`/api/reviews?ativo=true&limit=${maxReviews}`),
        fetch('/api/reviews/stats')
      ])
      
      const reviewsData = await reviewsResponse.json()
      const statsData = await statsResponse.json()
      
      if (reviewsResponse.ok) {
        setReviews(reviewsData.reviews || [])
      }
      
      if (statsResponse.ok) {
        setStats({
          mediaNotas: statsData.mediaNotas || 0,
          totalReviews: statsData.quantidadeTotal || 0
        })
      } else {
        // Fallback para estatísticas da API de reviews
        setStats({
          mediaNotas: reviewsData.stats?.mediaNotas || 0,
          totalReviews: reviewsData.stats?.totalReviews || 0
        })
      }
    } catch (error) {
      console.error('Erro ao carregar reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
    
    const fullStars = Math.floor(rating)
    const partialValue = rating - fullStars
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex items-center space-x-1">
        {/* Estrelas preenchidas */}
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
        ))}
        
        {/* Estrela parcial */}
        {partialValue > 0 && (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${partialValue * 100}%` }}
            >
              <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
            </div>
          </div>
        )}
        
        {/* Estrelas vazias */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
        ))}
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + itemsPerView
      return nextIndex >= reviews.length ? 0 : nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        // Vai para a última página
        const lastPageStart = Math.floor((reviews.length - 1) / itemsPerView) * itemsPerView
        return lastPageStart
      }
      return prev - itemsPerView
    })
  }

  const generateInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const renderAvatar = (review: Review) => {
    if (review.avatar) {
      return (
        <Image
          src={review.avatar}
          alt={review.nome}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
      )
    }

    const initials = review.avatarInitials || generateInitials(review.nome)
    const bgColor = review.avatarColor || '#3B82F6'

    return (
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`py-20 ${className}`}>
        <div className="container mx-auto px-4">
          {showHeader && (
            <div className="animate-pulse text-center mb-16">
              <div className="h-12 bg-gray-200 rounded-md mb-6 max-w-lg mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i} className="p-8 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={`py-20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">⭐</div>
            <p className="text-gray-500 text-xl">Nenhuma avaliação disponível no momento.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 ${className}`}>
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-16">
            {/* Título principal */}
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              O que nossos{' '}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                clientes
              </span>{' '}
              dizem
            </h2>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Histórias reais de clientes satisfeitos com nossos serviços especializados
            </p>
            
            {/* Estatísticas destacadas */}
            {stats.totalReviews > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                {/* Rating */}
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    {renderStars(stats.mediaNotas, 'lg')}
                    <span className="text-3xl font-bold text-gray-900 ml-2">
                      {stats.mediaNotas.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Total reviews */}
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                  <span className="text-lg font-semibold text-gray-700">
                    {stats.totalReviews} avaliações
                  </span>
                </div>

                {/* Verificado */}
                <div className="flex items-center bg-green-100 px-6 py-4 rounded-2xl shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-lg font-semibold text-green-800">
                    Verificado
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Reviews Grid - Responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {reviews.slice(currentIndex, currentIndex + itemsPerView).map((review) => (
              <div key={review.id}>
                <Card className="group h-full bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl overflow-hidden">
                  <div className="p-6 h-full flex flex-col min-h-[400px]">
                    {/* Quote Icon */}
                    <div className="relative mb-4">
                      <Quote className="w-10 h-10 text-yellow-400 opacity-30 absolute -top-2 -left-2" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center mb-4">
                      {renderStars(review.nota, 'md')}
                    </div>

                    {/* Comment */}
                    <div className="flex-1 mb-4">
                      <blockquote className="text-gray-700 text-center leading-relaxed italic text-base">
                        "{review.comentario}"
                      </blockquote>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-4 rounded-full"></div>

                    {/* Author */}
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {renderAvatar(review)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-1">
                        {review.nome}
                      </h4>
                      <p className="text-gray-500 text-sm font-medium">
                        {review.tempoRelativo}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {reviews.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-xl border transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                aria-label="Avaliação anterior"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-xl border transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                aria-label="Próxima avaliação"
                disabled={currentIndex + itemsPerView >= reviews.length}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {reviews.length > itemsPerView && (
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: Math.ceil(reviews.length / itemsPerView) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * itemsPerView)}
                  className={`transition-all duration-300 rounded-full ${
                    Math.floor(currentIndex / itemsPerView) === i
                      ? 'w-12 h-4 bg-gradient-to-r from-yellow-400 to-orange-400'
                      : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para página ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto shadow-xl border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🌟 Conte sua experiência!
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Sua opinião é muito importante para nós e ajuda outros clientes a nos conhecer melhor.
            </p>
            <a
              href="https://g.co/kgs/8DA9KGo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Star className="w-6 h-6 fill-current" />
              <span>Deixar Avaliação</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleStyleReviews 