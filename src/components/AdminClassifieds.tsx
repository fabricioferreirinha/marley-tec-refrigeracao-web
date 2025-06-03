"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { timeAgo } from '@/lib/utils'
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  MapPin,
  Calendar,
  MessageCircle,
  Clock,
  Info,
  HelpCircle
} from 'lucide-react'
import Image from 'next/image'
import { ImageUpload } from '@/components/ImageUpload'

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
  status: 'ATIVO' | 'INATIVO' | 'ARQUIVADO'
  destaque: boolean
  referencia: string
  createdAt: string
  updatedAt: string
}

const AdminClassifieds = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [filteredAnuncios, setFilteredAnuncios] = useState<Anuncio[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    arquivados: 0
  })

  const [newAnuncio, setNewAnuncio] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    categoria: 'GELADEIRA',
    condicao: 'EXCELENTE',
    localizacao: '',
    contato: '',
    whatsappMessage: '',
    destaque: false,
    imagens: [] as string[]
  })

  const [visibilidade, setVisibilidade] = useState({
    carouselAtivo: true,
    paginaAtivo: true
  })
  const [loadingVisibilidade, setLoadingVisibilidade] = useState(false)

  const categorias = [
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
    { value: 'OUTROS', label: 'Outros' },
    { value: 'CUSTOM', label: '+ Adicionar Nova Categoria' }
  ]

  const condicoes = [
    { 
      value: 'NOVO', 
      label: 'Novo',
      description: 'Produto lacrado, sem uso, na embalagem original',
      color: 'bg-green-100 text-green-800'
    },
    { 
      value: 'EXCELENTE', 
      label: 'Excelente',
      description: 'Usado em estado de novo, quase nenhuma marca de uso, condições excelentes',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      value: 'BOM', 
      label: 'Bom',
      description: 'Usado com sinais de uso normais, funcionando perfeitamente',
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      value: 'RAZOAVEL', 
      label: 'Razoável',
      description: 'Usado com sinais evidentes de uso, mas ainda funcional',
      color: 'bg-orange-100 text-orange-800'
    },
    { 
      value: 'RETIRADA_PECAS', 
      label: 'Retirada de Peças',
      description: 'Não funcional, apenas para aproveitamento de peças e componentes',
      color: 'bg-red-100 text-red-800'
    }
  ]

  useEffect(() => {
    fetchAnuncios()
    fetchVisibilidade()
  }, [])

  // Filtrar anúncios
  useEffect(() => {
    let filtered = anuncios
    
    if (searchTerm) {
      filtered = filtered.filter(anuncio => 
        anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anuncio.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anuncio.referencia.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(anuncio => anuncio.status === statusFilter)
    }
    
    setFilteredAnuncios(filtered)
  }, [anuncios, searchTerm, statusFilter])

  // Atualizar estatísticas
  useEffect(() => {
    setStats({
      total: anuncios.length,
      ativos: anuncios.filter(a => a.status === 'ATIVO').length,
      inativos: anuncios.filter(a => a.status === 'INATIVO').length,
      arquivados: anuncios.filter(a => a.status === 'ARQUIVADO').length,
    })
  }, [anuncios])

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('/api/anuncios?status=TODOS&limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setAnuncios(data.anuncios || [])
      } else {
        toast.error('Erro ao carregar anúncios')
      }
    } catch (error) {
      toast.error('Erro ao carregar anúncios')
    }
  }

  const fetchVisibilidade = async () => {
    try {
      const response = await fetch('/api/configuracoes/visibilidade')
      if (response.ok) {
        const data = await response.json()
        setVisibilidade(data)
      }
    } catch (error) {
      console.error('Erro ao buscar configurações de visibilidade:', error)
    }
  }

  const updateVisibilidade = async (campo: 'carouselAtivo' | 'paginaAtivo', valor: boolean) => {
    setLoadingVisibilidade(true)
    try {
      const novaVisibilidade = {
        ...visibilidade,
        [campo]: valor
      }

      const response = await fetch('/api/configuracoes/visibilidade', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaVisibilidade)
      })

      if (response.ok) {
        setVisibilidade(novaVisibilidade)
        toast.success(`${campo === 'carouselAtivo' ? 'Carousel' : 'Página'} de classificados ${valor ? 'ativado' : 'desativado'} com sucesso!`)
      } else {
        toast.error('Erro ao atualizar configuração de visibilidade')
      }
    } catch (error) {
      console.error('Erro ao atualizar visibilidade:', error)
      toast.error('Erro ao atualizar configuração de visibilidade')
    } finally {
      setLoadingVisibilidade(false)
    }
  }

  const handleCreateAnuncio = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAnuncio,
          preco: parseFloat(newAnuncio.preco),
          imagens: newAnuncio.imagens
        }),
      })
      
      if (response.ok) {
        await fetchAnuncios()
        setIsCreateModalOpen(false)
        setNewAnuncio({
          titulo: '',
          descricao: '', 
          preco: '', 
          categoria: 'GELADEIRA',
          condicao: 'EXCELENTE',
          localizacao: '',
          contato: '',
          whatsappMessage: '',
          destaque: false,
          imagens: []
        })
        toast.success('Anúncio criado com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao criar anúncio')
      }
    } catch (error) {
      toast.error('Erro ao criar anúncio')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAnuncio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnuncio) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/anuncios/${editingAnuncio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAnuncio),
      })
      
      if (response.ok) {
        await fetchAnuncios()
        setEditingAnuncio(null)
        toast.success('Anúncio atualizado com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao atualizar anúncio')
      }
    } catch (error) {
      toast.error('Erro ao atualizar anúncio')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnuncio = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return
    
    try {
      const response = await fetch(`/api/anuncios/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchAnuncios()
        toast.success('Anúncio excluído com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao excluir anúncio')
      }
    } catch (error) {
      toast.error('Erro ao excluir anúncio')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-green-100 text-green-800'
      case 'INATIVO': return 'bg-yellow-100 text-yellow-800'
      case 'ARQUIVADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: string) => {
    const cat = categorias.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const getConditionLabel = (condition: string) => {
    // Mapear valores antigos para novos labels
    const conditionMap: { [key: string]: string } = {
      'NOVO': 'Novo',
      'SEMINOVO': 'Excelente', // Mapear seminovo para excelente
      'USADO': 'Bom', // Mapear usado para bom
      'PARA_RETIRAR_PECAS': 'Retirada de Peças',
      'EXCELENTE': 'Excelente',
      'BOM': 'Bom',
      'RAZOAVEL': 'Razoável',
      'RETIRADA_PECAS': 'Retirada de Peças'
    }
    return conditionMap[condition] || condition
  }

  const getConditionColor = (condition: string) => {
    // Mapear valores antigos para novas cores
    const colorMap: { [key: string]: string } = {
      'NOVO': 'bg-green-100 text-green-800',
      'SEMINOVO': 'bg-blue-100 text-blue-800', // Mapear para excelente
      'USADO': 'bg-yellow-100 text-yellow-800', // Mapear para bom
      'PARA_RETIRAR_PECAS': 'bg-red-100 text-red-800',
      'EXCELENTE': 'bg-blue-100 text-blue-800',
      'BOM': 'bg-yellow-100 text-yellow-800',
      'RAZOAVEL': 'bg-orange-100 text-orange-800',
      'RETIRADA_PECAS': 'bg-red-100 text-red-800'
    }
    return colorMap[condition] || 'bg-gray-100 text-gray-800'
  }

  const getConditionDescription = (condition: string) => {
    const cond = condicoes.find(c => c.value === condition)
    return cond ? cond.description : ''
  }

  const handleCategoryChange = (value: string, isEditing = false) => {
    if (value === 'CUSTOM') {
      setShowCustomCategory(true)
      setCustomCategory('')
    } else {
      setShowCustomCategory(false)
      if (isEditing && editingAnuncio) {
        setEditingAnuncio({ ...editingAnuncio, categoria: value })
      } else {
        setNewAnuncio({ ...newAnuncio, categoria: value })
      }
    }
  }

  const handleCustomCategorySubmit = (isEditing = false) => {
    if (customCategory.trim()) {
      const categoryValue = customCategory.toUpperCase().replace(/\s+/g, '_')
      
      // Adicionar à lista de categorias se não existir
      const exists = categorias.find(c => c.value === categoryValue)
      if (!exists) {
        categorias.splice(-1, 0, { value: categoryValue, label: customCategory })
      }
      
      if (isEditing && editingAnuncio) {
        setEditingAnuncio({ ...editingAnuncio, categoria: categoryValue })
      } else {
        setNewAnuncio({ ...newAnuncio, categoria: categoryValue })
      }
      
      setShowCustomCategory(false)
      setCustomCategory('')
      toast.success('Nova categoria adicionada!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Classificados</h2>
          <p className="text-gray-600">Gerencie anúncios de eletrodomésticos usados</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Controles de Visibilidade - Melhorados */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Visibilidade no Site
                </h4>
                {loadingVisibilidade && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <Label htmlFor="carousel-ativo" className="text-sm font-medium text-gray-700">
                      Carousel de Anúncios
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Exibe classificados na página inicial
                    </p>
                  </div>
                <Switch
                  id="carousel-ativo"
                    checked={visibilidade.carouselAtivo}
                    onCheckedChange={(checked) => updateVisibilidade('carouselAtivo', checked)}
                    disabled={loadingVisibilidade}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <Label htmlFor="pagina-ativo" className="text-sm font-medium text-gray-700">
                      Página de Anúncios
                </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Permite acesso à página /classificados
                    </p>
              </div>
                <Switch
                  id="pagina-ativo"
                    checked={visibilidade.paginaAtivo}
                    onCheckedChange={(checked) => updateVisibilidade('paginaAtivo', checked)}
                    disabled={loadingVisibilidade}
                />
                </div>
              </div>
              
              {/* Status visual */}
              <div className="flex items-center justify-center space-x-4 pt-3 border-t">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${visibilidade.carouselAtivo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">Carousel</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${visibilidade.paginaAtivo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">Página</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Anúncio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAnuncio} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={newAnuncio.titulo}
                      onChange={(e) => setNewAnuncio({...newAnuncio, titulo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={newAnuncio.preco}
                      onChange={(e) => setNewAnuncio({...newAnuncio, preco: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={newAnuncio.categoria} onValueChange={(value) => handleCategoryChange(value)}>
                      <SelectTrigger>
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
                    
                    {showCustomCategory && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nome da nova categoria"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCustomCategorySubmit()}
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={() => handleCustomCategorySubmit()}
                        >
                          OK
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowCustomCategory(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="condicao">Condição</Label>
                      <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-6 left-0 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg p-2 w-64 z-50">
                          Passe o mouse sobre uma opção para ver a descrição
                        </div>
                      </div>
                    </div>
                    <Select value={newAnuncio.condicao} onValueChange={(value) => setNewAnuncio({...newAnuncio, condicao: value})}>
                      <SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={newAnuncio.descricao}
                    onChange={(e) => setNewAnuncio({...newAnuncio, descricao: e.target.value})}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contato">Contato *</Label>
                    <Input
                      id="contato"
                      value={newAnuncio.contato}
                      onChange={(e) => setNewAnuncio({...newAnuncio, contato: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input
                      id="localizacao"
                      value={newAnuncio.localizacao}
                      onChange={(e) => setNewAnuncio({...newAnuncio, localizacao: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="whatsappMessage">Mensagem WhatsApp</Label>
                  <Textarea
                    id="whatsappMessage"
                    value={newAnuncio.whatsappMessage}
                    onChange={(e) => setNewAnuncio({...newAnuncio, whatsappMessage: e.target.value})}
                    rows={2}
                    placeholder="Mensagem personalizada para WhatsApp (opcional)"
                  />
                </div>

                <div>
                  <Label>Imagens</Label>
                  <ImageUpload
                    value={newAnuncio.imagens}
                    onChange={(images) => setNewAnuncio({ ...newAnuncio, imagens: images })}
                    maxFiles={5}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="destaque"
                    checked={newAnuncio.destaque}
                    onCheckedChange={(checked) => setNewAnuncio({...newAnuncio, destaque: checked})}
                  />
                  <Label htmlFor="destaque">Anúncio em destaque</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Anúncio'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Arquivados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.arquivados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, descrição ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Status</SelectItem>
                  <SelectItem value="ATIVO">Ativos</SelectItem>
                  <SelectItem value="INATIVO">Inativos</SelectItem>
                  <SelectItem value="ARQUIVADO">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Anúncios */}
      <Card>
        <CardHeader>
          <CardTitle>Anúncios ({filteredAnuncios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAnuncios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum anúncio encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnuncios.map((anuncio) => (
                <div key={anuncio.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{anuncio.titulo}</h3>
                        <Badge className={getStatusColor(anuncio.status)}>
                          {anuncio.status}
                        </Badge>
                        {anuncio.destaque && (
                          <Badge className="bg-red-100 text-red-800">
                            <Star className="w-3 h-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Preço:</strong> {formatPrice(anuncio.preco)}</p>
                          <p><strong>Categoria:</strong> {getCategoryLabel(anuncio.categoria)}</p>
                        </div>
                        <div>
                          <p><strong>Condição:</strong> 
                            <Badge className={`ml-2 ${getConditionColor(anuncio.condicao)}`}>
                              {getConditionLabel(anuncio.condicao)}
                            </Badge>
                          </p>
                          <p><strong>Referência:</strong> {anuncio.referencia}</p>
                        </div>
                        <div>
                          {anuncio.localizacao && (
                            <p><strong>Localização:</strong> {anuncio.localizacao}</p>
                          )}
                          <p><strong>Criado:</strong> {timeAgo(anuncio.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 line-clamp-2">{anuncio.descricao}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingAnuncio(anuncio)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAnuncio(anuncio.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={!!editingAnuncio} onOpenChange={() => setEditingAnuncio(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Anúncio</DialogTitle>
          </DialogHeader>
          {editingAnuncio && (
            <form onSubmit={handleUpdateAnuncio} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-titulo">Título *</Label>
                  <Input
                    id="edit-titulo"
                    value={editingAnuncio.titulo}
                    onChange={(e) => setEditingAnuncio({...editingAnuncio, titulo: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-preco">Preço *</Label>
                  <Input
                    id="edit-preco"
                    type="number"
                    step="0.01"
                    value={editingAnuncio.preco}
                    onChange={(e) => setEditingAnuncio({...editingAnuncio, preco: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-categoria">Categoria</Label>
                  <Select value={editingAnuncio.categoria} onValueChange={(value) => handleCategoryChange(value, true)}>
                    <SelectTrigger>
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
                  
                  {showCustomCategory && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nome da nova categoria"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomCategorySubmit(true)}
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => handleCustomCategorySubmit(true)}
                      >
                        OK
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowCustomCategory(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="edit-condicao">Condição</Label>
                    <div className="group relative">
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-6 left-0 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg p-2 w-64 z-50">
                        Passe o mouse sobre uma opção para ver a descrição
                      </div>
                    </div>
                  </div>
                  <Select value={editingAnuncio.condicao} onValueChange={(value) => setEditingAnuncio({...editingAnuncio, condicao: value})}>
                    <SelectTrigger>
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
                
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingAnuncio.status} onValueChange={(value) => setEditingAnuncio({...editingAnuncio, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                      <SelectItem value="ARQUIVADO">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-descricao">Descrição *</Label>
                <Textarea
                  id="edit-descricao"
                  value={editingAnuncio.descricao}
                  onChange={(e) => setEditingAnuncio({...editingAnuncio, descricao: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contato">Contato *</Label>
                  <Input
                    id="edit-contato"
                    value={editingAnuncio.contato}
                    onChange={(e) => setEditingAnuncio({...editingAnuncio, contato: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-localizacao">Localização</Label>
                  <Input
                    id="edit-localizacao"
                    value={editingAnuncio.localizacao || ''}
                    onChange={(e) => setEditingAnuncio({...editingAnuncio, localizacao: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-whatsappMessage">Mensagem WhatsApp</Label>
                <Textarea
                  id="edit-whatsappMessage"
                  value={editingAnuncio.whatsappMessage || ''}
                  onChange={(e) => setEditingAnuncio({...editingAnuncio, whatsappMessage: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <Label>Imagens</Label>
                <ImageUpload
                  value={editingAnuncio.imagens}
                  onChange={(images) => setEditingAnuncio({...editingAnuncio, imagens: images})}
                  maxFiles={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-destaque"
                  checked={editingAnuncio.destaque}
                  onCheckedChange={(checked) => setEditingAnuncio({...editingAnuncio, destaque: checked})}
                />
                <Label htmlFor="edit-destaque">Anúncio em destaque</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingAnuncio(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminClassifieds 