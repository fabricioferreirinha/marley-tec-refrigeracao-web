"use client"

import React, { useState, useEffect } from 'react'
import { Search, Filter, X, Eye, MessageCircle, MapPin, Calendar, ArrowLeft, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const ClassificadosPage = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [filteredAnuncios, setFilteredAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('TODOS')
  const [condicaoFilter, setCondicaoFilter] = useState('TODOS')
  const [minPreco, setMinPreco] = useState('')
  const [maxPreco, setMaxPreco] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  // Filtros aplicados (diferentes dos filtros de input)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    categoriaFilter: 'TODOS',
    condicaoFilter: 'TODOS',
    minPreco: '',
    maxPreco: ''
  })

  // Adicionar estado para verificar visibilidade
  const [pageEnabled, setPageEnabled] = useState(true)
  const [loadingVisibility, setLoadingVisibility] = useState(true)

  const categorias = [
    { value: 'TODOS', label: 'Todas as Categorias' },
    { value: 'GELADEIRA', label: 'Geladeira' },
    { value: 'FREEZER', label: 'Freezer' },
    { value: 'MAQUINA_LAVAR', label: 'Máquina de Lavar' },
    { value: 'SECADORA', label: 'Secadora' },
    { value: 'LAVA_LOUCAS', label: 'Lava Louças' },
    { value: 'MICROONDAS', label: 'Microondas' },
    { value: 'FORNO', label: 'Forno' },
    { value: 'FOGAO', label: 'Fogão' },
    { value: 'COOKTOP', label: 'Cooktop' },
    { value: 'AR_CONDICIONADO', label: 'Ar Condicionado' },
    { value: 'VENTILADOR', label: 'Ventilador' },
    { value: 'PURIFICADOR_AGUA', label: 'Purificador de Água' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  const condicoes = [
    { value: 'TODOS', label: 'Todas as Condições' },
    { value: 'NOVO', label: 'Novo' },
    { value: 'SEMINOVO', label: 'Semi-novo' },
    { value: 'USADO', label: 'Usado' },
    { value: 'PARA_RETIRAR_PECAS', label: 'Para Retirar Peças' }
  ]

  useEffect(() => {
    setCurrentPage(1) // Reset página quando filtros aplicados mudarem
  }, [appliedFilters])

  useEffect(() => {
    fetchAnuncios()
  }, [currentPage, appliedFilters])

  // Verificar visibilidade da página no início
  useEffect(() => {
    const checkPageVisibility = async () => {
      try {
        const response = await fetch('/api/configuracoes/visibilidade')
        if (response.ok) {
          const data = await response.json()
          setPageEnabled(data.paginaAtivo)
        }
      } catch (error) {
        console.error('Erro ao verificar visibilidade da página:', error)
        // Em caso de erro, manter a página visível
        setPageEnabled(true)
      } finally {
        setLoadingVisibility(false)
      }
    }

    checkPageVisibility()
  }, [])

  const fetchAnuncios = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: 'ATIVO'
      })
      
      if (appliedFilters.searchTerm) params.append('search', appliedFilters.searchTerm)
      if (appliedFilters.categoriaFilter !== 'TODOS') params.append('categoria', appliedFilters.categoriaFilter)
      if (appliedFilters.condicaoFilter !== 'TODOS') params.append('condicao', appliedFilters.condicaoFilter)
      if (appliedFilters.minPreco) params.append('minPreco', appliedFilters.minPreco)
      if (appliedFilters.maxPreco) params.append('maxPreco', appliedFilters.maxPreco)

      const response = await fetch(`/api/anuncios?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnuncios(data.anuncios)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aplicar todos os filtros
    setAppliedFilters({
      searchTerm,
      categoriaFilter,
      condicaoFilter,
      minPreco,
      maxPreco
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategoriaFilter('TODOS')
    setCondicaoFilter('TODOS')
    setMinPreco('')
    setMaxPreco('')
    setCurrentPage(1)
    setAppliedFilters({
      searchTerm: '',
      categoriaFilter: 'TODOS',
      condicaoFilter: 'TODOS',
      minPreco: '',
      maxPreco: ''
    })
  }

  const openModal = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio)
    setCurrentImageIndex(0)
  }

  const closeModal = () => {
    setSelectedAnuncio(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedAnuncio && currentImageIndex < selectedAnuncio.imagens.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
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
    const cat = categorias.find(c => c.value === category)
    return cat ? cat.label : category
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

  // Se ainda está verificando a visibilidade
  if (loadingVisibility) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se a página está desabilitada
  if (!pageEnabled) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Voltar ao Site</span>
              </Link>
              <div className="border-l h-6 border-gray-300" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Classificados</h1>
            </div>
          </div>
        </div>

        {/* Conteúdo quando página está desabilitada */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Classificados Temporariamente Indisponíveis
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nossa seção de classificados está temporariamente fora do ar para manutenção. 
              Em breve estará novamente disponível com novos produtos e melhorias.
            </p>
            
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Enquanto isso, entre em contato conosco diretamente:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  href="https://wa.me/5521997496201"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <MessageCircle className="w-6 h-6" />
                  Contato via WhatsApp
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Voltar à Página Inicial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Se a página está habilitada, renderizar normalmente
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Voltar ao Site</span>
                </Link>
                <div className="border-l h-6 border-gray-300" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Classificados</h1>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full sm:w-auto"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </div>

            {/* Barra de busca */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por produto, descrição ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <Button type="submit" className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
                Buscar
              </Button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Sidebar de Filtros */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-4 sm:space-y-6`}>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Filtros</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Limpar
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Categoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map(categoria => (
                            <SelectItem key={categoria.value} value={categoria.value}>
                              {categoria.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Condição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condição
                      </label>
                      <Select value={condicaoFilter} onValueChange={setCondicaoFilter}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {condicoes.map(condicao => (
                            <SelectItem key={condicao.value} value={condicao.value}>
                              {condicao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Faixa de Preço */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faixa de Preço
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Mín"
                          value={minPreco}
                          onChange={(e) => setMinPreco(e.target.value)}
                          className="h-10 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Máx"
                          value={maxPreco}
                          onChange={(e) => setMaxPreco(e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão Aplicar Filtros */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleSearch}
                      className="w-full text-sm sm:text-base h-10"
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Anúncios */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
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
              ) : anuncios.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Nenhum anúncio encontrado
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Tente ajustar os filtros ou fazer uma nova busca
                  </p>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  {/* Grid de Anúncios */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {anuncios.map((anuncio) => (
                      <Card 
                        key={anuncio.id} 
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 flex flex-col h-full"
                        onClick={() => openModal(anuncio)}
                      >
                        <div className="relative">
                          {anuncio.imagens && anuncio.imagens.length > 0 ? (
                            <Image
                              src={anuncio.imagens[0]}
                              alt={anuncio.titulo}
                              width={400}
                              height={200}
                              className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-44 sm:h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm sm:text-base">📷 Sem imagem</span>
                            </div>
                          )}
                          
                          {anuncio.destaque && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-xs sm:text-sm">
                              ⭐ Destaque
                            </Badge>
                          )}
                          
                          <Badge className={`absolute top-2 right-2 text-xs sm:text-sm ${getConditionColor(anuncio.condicao)}`}>
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
                          
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 flex-1">
                            {anuncio.descricao}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1 sm:gap-0">
                            <span className="text-xl sm:text-2xl font-bold text-green-600">
                              {formatPrice(anuncio.preco)}
                            </span>
                            {anuncio.localizacao && (
                              <div className="flex items-center text-gray-500 text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-24 sm:max-w-none">{anuncio.localizacao}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(anuncio.createdAt)}
                            </div>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleWhatsAppContact(anuncio)
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 font-semibold text-xs sm:text-sm mt-auto"
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="hidden sm:inline">Entrar em Contato</span>
                            <span className="sm:hidden">Contato</span>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="text-xs sm:text-sm"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Anterior</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
                              >
                                {page}
                              </Button>
                            )
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return <span key={page} className="px-1 sm:px-2 text-xs sm:text-sm">...</span>
                          }
                          return null
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Próxima</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Anúncio - Melhorado para responsividade */}
      <Dialog open={!!selectedAnuncio} onOpenChange={closeModal}>
        <DialogContent className="max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto p-0 mx-4">
          {selectedAnuncio && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold pr-8">
                  {selectedAnuncio.titulo}
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-sm sm:text-base">
                  Detalhes do produto selecionado
                </DialogDescription>
              </DialogHeader>

              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Galeria de Imagens */}
                  <div className="space-y-4">
                    {selectedAnuncio.imagens && selectedAnuncio.imagens.length > 0 ? (
                      <>
                        <div className="relative">
                          <Image
                            src={selectedAnuncio.imagens[currentImageIndex]}
                            alt={selectedAnuncio.titulo}
                            width={400}
                            height={300}
                            className="w-full h-48 sm:h-64 lg:h-80 object-contain bg-gray-50 rounded-lg"
                          />
                          
                          {selectedAnuncio.imagens.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                disabled={currentImageIndex === 0}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full disabled:opacity-50 hover:bg-black/90 transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={nextImage}
                                disabled={currentImageIndex === selectedAnuncio.imagens.length - 1}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full disabled:opacity-50 hover:bg-black/90 transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                        
                        {selectedAnuncio.imagens.length > 1 && (
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {selectedAnuncio.imagens.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  currentImageIndex === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Image
                                  src={image}
                                  alt={`${selectedAnuncio.titulo} ${index + 1}`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-48 sm:h-64 lg:h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm sm:text-base">📷 Sem imagem disponível</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do Anúncio */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge className={`text-xs sm:text-sm ${getConditionColor(selectedAnuncio.condicao)}`}>
                        {getConditionLabel(selectedAnuncio.condicao)}
                      </Badge>
                      {selectedAnuncio.destaque && (
                        <Badge className="bg-red-500 text-xs sm:text-sm">⭐ Destaque</Badge>
                      )}
                    </div>

                    <div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                        {formatPrice(selectedAnuncio.preco)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500 font-medium">Categoria:</span>
                          <p className="font-semibold">{getCategoryLabel(selectedAnuncio.categoria)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Referência:</span>
                          <p className="font-semibold">{selectedAnuncio.referencia}</p>
                        </div>
                      </div>
                      
                      {selectedAnuncio.localizacao && (
                        <div>
                          <span className="text-gray-500 font-medium">Localização:</span>
                          <p className="font-semibold flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedAnuncio.localizacao}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-500 font-medium">Publicado:</span>
                        <p className="font-semibold">{formatDate(selectedAnuncio.createdAt)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Descrição</h4>
                      <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line max-h-32 overflow-y-auto">
                        {selectedAnuncio.descricao}
                      </p>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleWhatsAppContact(selectedAnuncio)
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-sm sm:text-base font-semibold"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Entrar em Contato
                      </Button>
                      
                      <Button 
                        onClick={closeModal}
                        variant="outline" 
                        className="w-full text-sm sm:text-base"
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ClassificadosPage 