"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ExternalLink, Quote, Users, Award, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  author_name: string
  author_url: string
  language: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface ReviewsData {
  reviews: Review[]
  rating_average: number
  total_reviews: number
  place_id: string
  business_name: string
  status: string
}

const SimpleGoogleReviews = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/reviews?limit=5')
      const data = await response.json()
      
      if (response.ok && data.status === 'OK') {
        setReviewsData(data)
      } else {
        setError(data.error || 'Erro ao carregar reviews')
      }
    } catch (err) {
      setError('Erro de conexão ao carregar reviews')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size,
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded-md w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded-md w-96 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <Quote className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ops! Não conseguimos carregar os reviews
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchReviews}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ⭐ O que Nossos Clientes Dizem
          </h2>
          <p className="text-gray-600">Nenhum review disponível no momento.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              O que Nossos Clientes Dizem
            </h2>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
          
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              {renderStars(reviewsData.rating_average, 'w-6 h-6')}
              <span className="text-2xl font-bold text-gray-800">
                {reviewsData.rating_average.toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-semibold">
                {reviewsData.total_reviews} avaliações
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" 
              alt="Google" 
              className="w-6 h-6"
            />
            <span className="text-gray-600">Avaliações verificadas pelo Google</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <ThumbsUp className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviewsData.reviews.map((review, index) => (
            <Card 
              key={review.id} 
              className={cn(
                "border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm",
                index === 1 && "md:scale-105 md:z-10" // Destaque para o review do meio
              )}
            >
              <CardContent className="p-6">
                {/* Header do Review */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={review.profile_photo_url} 
                        alt={review.author_name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                        {getInitials(review.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.author_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {review.relative_time_description}
                      </p>
                    </div>
                  </div>
                  
                  {review.author_url && (
                    <a
                      href={review.author_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium text-gray-700">
                    {review.rating}.0
                  </span>
                </div>

                {/* Review Text */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200 opacity-50" />
                  <blockquote className="text-gray-700 leading-relaxed italic pl-6">
                    "{truncateText(review.text)}"
                  </blockquote>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Via Google Reviews
                    </span>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Você também pode avaliar nosso serviço! 🌟
            </h3>
            <p className="text-gray-600 mb-6">
              Sua opinião é muito importante para nós e ajuda outros clientes a nos conhecer melhor.
            </p>
            <a
              href={`https://search.google.com/local/writereview?placeid=${reviewsData.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Star className="w-5 h-5 fill-current" />
              <span>Deixar Avaliação no Google</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SimpleGoogleReviews 