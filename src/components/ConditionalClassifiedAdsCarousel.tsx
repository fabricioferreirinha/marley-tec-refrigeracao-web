"use client"

import React, { useState, useEffect } from 'react'
import ClassifiedAdsCarousel from './ClassifiedAdsCarousel'

const ConditionalClassifiedAdsCarousel = () => {
  const [shouldShow, setShouldShow] = useState(true) // Default true para evitar flicker
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisibilityConfig = async () => {
      try {
        const response = await fetch('/api/configuracoes/visibilidade')
        if (response.ok) {
          const data = await response.json()
          setShouldShow(data.carouselAtivo)
        }
      } catch (error) {
        console.error('Erro ao verificar configuração de visibilidade:', error)
        // Em caso de erro, manter o carousel visível
        setShouldShow(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVisibilityConfig()
  }, [])

  // Se ainda está carregando, não renderiza nada para evitar flicker
  if (loading) {
    return null
  }

  // Se não deve mostrar, não renderiza o componente
  if (!shouldShow) {
    return null
  }

  // Se deve mostrar, renderiza o carousel normalmente
  return <ClassifiedAdsCarousel />
}

export default ConditionalClassifiedAdsCarousel 