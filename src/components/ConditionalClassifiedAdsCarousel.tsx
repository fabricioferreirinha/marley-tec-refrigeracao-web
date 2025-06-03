"use client"

import React, { useState, useEffect } from 'react'
import ClassifiedAdsCarousel from './ClassifiedAdsCarousel'

const ConditionalClassifiedAdsCarousel = () => {
  const [shouldShow, setShouldShow] = useState(true) // Default true para evitar flicker
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 3

    const fetchVisibilityConfig = async () => {
      try {
        setHasError(false)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

        const response = await fetch('/api/configuracoes/visibilidade', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (mounted) {
            setShouldShow(data.carouselAtivo)
            setLoading(false)
          }
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        console.error('Erro ao verificar configuração de visibilidade:', error)
        
        if (mounted) {
          setHasError(true)
          
          // Se for erro de rede/timeout e ainda temos tentativas, tentar novamente
          if (retryCount < maxRetries && (error.name === 'AbortError' || error.name === 'TypeError')) {
            retryCount++
            console.log(`🔄 Tentativa ${retryCount}/${maxRetries} para buscar configurações de visibilidade`)
            setTimeout(() => {
              if (mounted) {
                fetchVisibilityConfig()
              }
            }, 1000 * retryCount) // Delay progressivo
            return
          }
          
          // Em caso de erro persistente, manter o carousel visível e parar o loading
          console.log('⚠️ Mantendo carousel visível devido a erro na API')
          setShouldShow(true)
          setLoading(false)
        }
      }
    }

    fetchVisibilityConfig()

    return () => {
      mounted = false
    }
  }, [])

  // Se ainda está carregando, mostrar placeholder ou nada
  if (loading) {
    return (
      <div className="py-4">
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </div>
    )
  }

  // Se teve erro persistente, mostrar carousel com aviso no console
  if (hasError) {
    console.log('🔧 [ConditionalClassifiedAdsCarousel] Exibindo carousel apesar de erro na API')
  }

  // Se não deve mostrar, não renderiza o componente
  if (!shouldShow) {
    return null
  }

  // Se deve mostrar, renderiza o carousel normalmente
  return <ClassifiedAdsCarousel />
}

export default ConditionalClassifiedAdsCarousel 