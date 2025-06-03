"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle, Eye, MapPin, Calendar, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface Anuncio {
  id: string
  titulo: string
  descricao: string
  preco: number
  categoria: string
  condicao: string
  localizacao?: string
  imagens: string[]
  contato: string
  whatsappMessage?: string
  status: string
  destaque: boolean
  referencia: string
  createdAt: string
  updatedAt: string
}

const ClassifiedAdsCarousel = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Função para determinar quantos itens mostrar baseado no tamanho da tela
  const updateItemsPerView = useCallback(() => {
    const width = window.innerWidth
    if (width < 640) { // mobile - 1 anúncio por vez
      setItemsPerView(1)
    } else if (width < 1024) { // tablet - 2 anúncios
      setItemsPerView(2)
    } else { // desktop - exatamente 3 anúncios (sem cortes)
      setItemsPerView(3)
    }
  }, [])

  useEffect(() => {
    fetchAnuncios()
    updateItemsPerView()

    const handleResize = () => updateItemsPerView()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateItemsPerView])

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('/api/anuncios?status=ATIVO&limit=12')
      const data = await response.json()
      
      if (response.ok) {
        setAnuncios(data.anuncios || [])
      }
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    const maxIndex = Math.max(0, anuncios.length - itemsPerView)
    setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1)
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, anuncios.length - itemsPerView)
    setCurrentIndex((prev) => prev <= 0 ? maxIndex : prev - 1)
  }

  const openAnuncioModal = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio)
    setSelectedImageIndex(0)
  }

  const closeModal = () => {
    setSelectedAnuncio(null)
    setSelectedImageIndex(0)
  }

  const handleWhatsAppContact = (anuncio: Anuncio) => {
    const phoneNumber = "5521997496201"
    const message = encodeURIComponent(
      anuncio.whatsappMessage || 
      `Olá! Tenho interesse no anúncio: ${anuncio.titulo} - Ref: ${anuncio.referencia}. Poderia me dar mais informações?`
    )
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getConditionColor = (condition: string) => {
    const colorMap: { [key: string]: string } = {
      'NOVO': 'bg-green-100 text-green-800',
      'SEMINOVO': 'bg-blue-100 text-blue-800',
      'USADO': 'bg-yellow-100 text-yellow-800',
      'PARA_RETIRAR_PECAS': 'bg-red-100 text-red-800',
      'EXCELENTE': 'bg-blue-100 text-blue-800',
      'BOM': 'bg-yellow-100 text-yellow-800',
      'RAZOAVEL': 'bg-orange-100 text-orange-800',
      'RETIRADA_PECAS': 'bg-red-100 text-red-800'
    }
    return colorMap[condition] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const categorias = {
      'GELADEIRA': 'Geladeira',
      'FREEZER': 'Freezer',
      'MAQUINA_LAVAR': 'Máquina de Lavar',
      'SECADORA': 'Secadora',
      'LAVA_LOUCAS': 'Lava Louças',
      'MICROONDAS': 'Microondas',
      'FORNO': 'Forno',
      'FOGAO': 'Fogão',
      'COOKTOP': 'Cooktop',
      'AR_CONDICIONADO': 'Ar Condicionado',
      'VENTILADOR': 'Ventilador',
      'PURIFICADOR_AGUA': 'Purificador de Água',
      'OUTROS': 'Outros'
    }
    return categorias[category as keyof typeof categorias] || category
  }

  const getConditionLabel = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'NOVO': 'Novo',
      'SEMINOVO': 'Semi-novo',
      'USADO': 'Usado',
      'EXCELENTE': 'Excelente',
      'BOM': 'Bom',
      'RAZOAVEL': 'Razoável',
      'RETIRADA_PECAS': 'Retirada de Peças',
      'PARA_RETIRAR_PECAS': 'Para Retirar Peças',
      // Manter compatibilidade com valores antigos
      'novo': 'Novo',
      'seminovo': 'Semi-novo',
      'usado': 'Usado',
      'usado_bom_estado': 'Usado - Bom Estado',
      'usado_estado_regular': 'Usado - Estado Regular',
      'para_reparo': 'Para Reparo'
    }
    return conditionMap[condition] || condition
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
                <div className="h-48 sm:h-56 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (anuncios.length === 0) {
    return null
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
             Eletrodomésticos Usados
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Equipamentos revisados e testados, com garantia de funcionamento e preços especiais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6 sm:mb-8">
            <Link 
              href="/classificados"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              Ver Todos os Classificados
            </Link>
          </div>
        </div>

        {/* Carousel - Corrigido para Responsividade Perfeita */}
        <div className="relative max-w-7xl mx-auto">
          {anuncios.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hidden sm:block"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hidden sm:block"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden px-1 sm:px-2">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-2 sm:gap-4"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {anuncios.map((anuncio, index) => (
                <div
                  key={anuncio.id}
                  className="flex-shrink-0"
                  style={{ 
                    width: `calc(${100 / itemsPerView}% - ${
                      itemsPerView === 1 ? '8px' : 
                      itemsPerView === 2 ? '12px' : 
                      '16px'
                    })`,
                    maxWidth: itemsPerView === 1 ? '100%' : 
                             itemsPerView === 2 ? '380px' : 
                             '320px'
                  }}
                >
                  <Card 
                    className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
                    onClick={() => openAnuncioModal(anuncio)}
                  >
                    <div className="relative">
                      {anuncio.imagens && anuncio.imagens.length > 0 ? (
                        <Image
                          src={anuncio.imagens[0]}
                          alt={anuncio.titulo}
                          width={300}
                          height={200}
                          className="w-full h-40 sm:h-44 lg:h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 sm:h-44 lg:h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        </div>
                      )}
                      
                      {anuncio.destaque && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-xs">Destaque</Badge>
                      )}
                      
                      <Badge className={`absolute top-2 right-2 text-xs ${getConditionColor(anuncio.condicao)}`}>
                        {getConditionLabel(anuncio.condicao)}
                      </Badge>
                    </div>

                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">
                          {getCategoryLabel(anuncio.categoria)} • Ref: {anuncio.referencia}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
                        {anuncio.titulo}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed text-sm flex-1">
                        {anuncio.descricao}
                      </p>
                      
                      <div className="flex flex-col gap-2 mb-3">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                          {formatPrice(anuncio.preco)}
                        </span>
                        {anuncio.localizacao && (
                          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{anuncio.localizacao}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {formatDate(anuncio.createdAt)}
                      </div>

                      <div className="mt-auto">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWhatsAppContact(anuncio)
                          }}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 sm:py-3"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Entrar em Contato</span>
                          <span className="sm:hidden">Contato</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          {anuncios.length > itemsPerView && (
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {Array.from({ length: Math.max(1, Math.ceil(anuncios.length / itemsPerView)) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Botões de navegação para mobile */}
          {anuncios.length > itemsPerView && (
            <div className="flex justify-center mt-4 space-x-4 sm:hidden">
              <button
                onClick={prevSlide}
                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedAnuncio} onOpenChange={closeModal}>
        <DialogContent className="max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto p-0 mx-4">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold pr-8">
              {selectedAnuncio?.titulo}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm sm:text-base">
              Detalhes do produto selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnuncio && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Galeria de Imagens */}
                {selectedAnuncio.imagens && selectedAnuncio.imagens.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Image
                        src={selectedAnuncio.imagens[selectedImageIndex]}
                        alt={selectedAnuncio.titulo}
                        width={500}
                        height={400}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                      />
                      
                      {selectedAnuncio.imagens.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === 0 ? selectedAnuncio.imagens.length - 1 : prev - 1
                            )}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 sm:p-2 rounded-full hover:bg-black/70 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === selectedAnuncio.imagens.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 sm:p-2 rounded-full hover:bg-black/70 transition-all"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {selectedAnuncio.imagens.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedAnuncio.imagens.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative overflow-hidden rounded-lg ${
                              selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${selectedAnuncio.titulo} - ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-16 sm:h-20 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Informações do Produto */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getConditionColor(selectedAnuncio.condicao)}>
                      {getConditionLabel(selectedAnuncio.condicao)}
                    </Badge>
                    <Badge variant="outline">
                      {getCategoryLabel(selectedAnuncio.categoria)}
                    </Badge>
                    {selectedAnuncio.destaque && (
                      <Badge className="bg-red-500">Destaque</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                      {formatPrice(selectedAnuncio.preco)}
                    </h3>
                    <p className="text-gray-500 text-sm">Ref: {selectedAnuncio.referencia}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Descrição</h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {selectedAnuncio.descricao}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">Categoria:</span>
                      <p className="text-gray-600">{getCategoryLabel(selectedAnuncio.categoria)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Condição:</span>
                      <p className="text-gray-600">{getConditionLabel(selectedAnuncio.condicao)}</p>
                    </div>
                    {selectedAnuncio.localizacao && (
                      <div>
                        <span className="font-semibold text-gray-900">Localização:</span>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedAnuncio.localizacao}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-900">Publicado em:</span>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(selectedAnuncio.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="space-y-3 mt-6">
                    <Button
                      onClick={() => handleWhatsAppContact(selectedAnuncio)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">Entrar em Contato via WhatsApp</span>
                      <span className="sm:hidden">Contato WhatsApp</span>
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/classificados">
                        <Button
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 text-sm sm:text-base"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Todos
                        </Button>
                      </Link>
                      
                      <Button
                        onClick={closeModal}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 text-sm sm:text-base"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Fechar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default ClassifiedAdsCarousel

