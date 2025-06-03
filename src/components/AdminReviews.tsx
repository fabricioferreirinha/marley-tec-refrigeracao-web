"use client"

import { useState, useEffect } from 'react'
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
import { ImageUpload } from '@/components/ImageUpload'
import { 
  Star, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  User,
  Calendar,
  Eye,
  Settings,
  Palette,
  Clock,
  Image as ImageIcon
} from 'lucide-react'

interface Review {
  id: string
  nome: string
  avatar?: string
  avatarColor?: string
  avatarInitials?: string
  nota: number
  comentario: string
  tempoRelativo: string
  ativo: boolean
  source: string
  createdAt: string
  updatedAt: string
}

// Cores predefinidas para avatars
const avatarColors = [
  { name: 'Azul', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Verde', value: '#10B981', class: 'bg-green-500' },
  { name: 'Roxo', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Rosa', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Laranja', value: '#F97316', class: 'bg-orange-500' },
  { name: 'Vermelho', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Ciano', value: '#06B6D4', class: 'bg-cyan-500' },
  { name: 'Amarelo', value: '#EAB308', class: 'bg-yellow-500' },
  { name: 'Índigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Cinza', value: '#6B7280', class: 'bg-gray-500' },
]

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    mediaNotas: 4.8, // Valor editável manualmente
    quantidadeTotal: 127 // Quantidade total editável (aparece no site)
  })

  const [newReview, setNewReview] = useState({
    nome: '',
    avatar: '',
    avatarColor: '#3B82F6',
    avatarInitials: '',
    nota: 5,
    comentario: '',
    tempoRelativo: '1 semana atrás'
  })

  const [isEditingStats, setIsEditingStats] = useState(false)
  const [tempStats, setTempStats] = useState({
    mediaNotas: 4.8,
    quantidadeTotal: 127
  })

  useEffect(() => {
    fetchReviews()
    fetchEditableStats()
  }, [])

  const fetchEditableStats = async () => {
    try {
      const response = await fetch('/api/reviews/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(prev => ({
          ...prev,
          mediaNotas: data.mediaNotas || 4.8,
          quantidadeTotal: data.quantidadeTotal || 127
        }))
        setTempStats({
          mediaNotas: data.mediaNotas || 4.8,
          quantidadeTotal: data.quantidadeTotal || 127
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas editáveis:', error)
    }
  }

  // Filtrar reviews
  useEffect(() => {
    let filtered = reviews
    
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comentario.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter === 'ATIVO') {
      filtered = filtered.filter(review => review.ativo)
    } else if (statusFilter === 'INATIVO') {
      filtered = filtered.filter(review => !review.ativo)
    }
    
    setFilteredReviews(filtered)
  }, [reviews, searchTerm, statusFilter])

  // Atualizar estatísticas
  useEffect(() => {
    const total = reviews.length
    const ativos = reviews.filter(r => r.ativo).length

    setStats(prev => ({
      ...prev,
      total,
      ativos,
      inativos: total - ativos
    }))
  }, [reviews])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
      } else {
        toast.error('Erro ao carregar reviews')
      }
    } catch (error) {
      toast.error('Erro ao carregar reviews')
    }
  }

  const generateInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const finalInitials = newReview.avatarInitials || generateInitials(newReview.nome)
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          avatarInitials: finalInitials,
          avatar: newReview.avatar || null,
          source: 'SITE'
        }),
      })
      
      if (response.ok) {
        await fetchReviews()
        setIsCreateModalOpen(false)
        setNewReview({
          nome: '',
          avatar: '',
          avatarColor: '#3B82F6',
          avatarInitials: '',
          nota: 5,
          comentario: '',
          tempoRelativo: '1 semana atrás'
        })
        toast.success('Review criado com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao criar review')
      }
    } catch (error) {
      toast.error('Erro ao criar review')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/reviews/${editingReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingReview,
          source: editingReview.source || 'SITE'
        })
      })
      
      if (response.ok) {
        await fetchReviews()
        setEditingReview(null)
        toast.success('Review atualizado com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao atualizar review')
      }
    } catch (error) {
      toast.error('Erro ao atualizar review')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este review?')) return
    
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchReviews()
        toast.success('Review removido com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao remover review')
      }
    } catch (error) {
      toast.error('Erro ao remover review')
    }
  }

  const updateMediaNotas = async (newMedia: number) => {
    // Aqui você pode implementar uma API para salvar a média global
    // Por enquanto, apenas atualiza o estado local
    setStats(prev => ({ ...prev, mediaNotas: newMedia }))
    toast.success('Média de avaliações atualizada!')
  }

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    const fullStars = Math.floor(rating)
    const partialValue = rating - fullStars
    const emptyStars = 5 - Math.ceil(rating)

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return (
          <Star 
            key={i} 
            className={`${size} text-yellow-400 fill-current`} 
          />
        )
      } else if (i === fullStars && partialValue > 0) {
        return (
          <div key={i} className="relative">
            <Star className={`${size} text-gray-300`} />
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${partialValue * 100}%` }}
            >
              <Star className={`${size} text-yellow-400 fill-current`} />
            </div>
          </div>
        )
      } else {
        return (
          <Star 
            key={i} 
            className={`${size} text-gray-300`} 
          />
        )
      }
    })
  }

  const renderAvatar = (review: Review, size: string = "w-10 h-10") => {
    if (review.avatar) {
      return (
        <div className={`${size} rounded-full overflow-hidden`}>
          <img 
            src={review.avatar} 
            alt={review.nome}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }

    const initials = review.avatarInitials || generateInitials(review.nome)
    const bgColor = review.avatarColor || '#3B82F6'

    return (
      <div 
        className={`${size} rounded-full flex items-center justify-center text-white font-bold text-sm`}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Avaliações</h2>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-gray-600">Gerencie reviews e testemunhos de clientes</p>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-full">
              <div className="flex">
                {renderStars(Math.round(stats.mediaNotas), "w-4 h-4")}
              </div>
              <span className="font-semibold text-yellow-800">{stats.mediaNotas}</span>
              <span className="text-yellow-700">({stats.quantidadeTotal} avaliações)</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingStats(true)}
                className="ml-2"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Avaliação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Cliente *</Label>
                  <Input
                    id="nome"
                    value={newReview.nome}
                    onChange={(e) => {
                      const nome = e.target.value
                      setNewReview({
                        ...newReview, 
                        nome,
                        avatarInitials: newReview.avatarInitials || generateInitials(nome)
                      })
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nota">Nota *</Label>
                  <Select value={newReview.nota.toString()} onValueChange={(value) => setNewReview({...newReview, nota: parseFloat(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(nota => (
                        <SelectItem key={nota} value={nota.toString()}>
                          <div className="flex items-center space-x-1">
                            <span>{nota}</span>
                            <div className="flex">
                              {renderStars(nota)}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="comentario">Comentário *</Label>
                <Textarea
                  id="comentario"
                  value={newReview.comentario}
                  onChange={(e) => setNewReview({...newReview, comentario: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tempoRelativo">Tempo Relativo *</Label>
                <Input
                  id="tempoRelativo"
                  value={newReview.tempoRelativo}
                  onChange={(e) => setNewReview({...newReview, tempoRelativo: e.target.value})}
                  placeholder="Ex: 1 semana atrás, 3 dias atrás, 1 mês atrás"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este texto aparecerá como tempo da avaliação (ex: "1 semana atrás")
                </p>
              </div>

              {/* Avatar Configuration */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Configuração do Avatar
                </h4>
                
                <div>
                  <Label>Foto do Cliente (opcional)</Label>
                  <ImageUpload
                    value={newReview.avatar ? [newReview.avatar] : []}
                    onChange={(images) => setNewReview({...newReview, avatar: images[0] || ''})}
                    maxFiles={1}
                    maxSize={2}
                    className="mt-2"
                  />
                </div>

                {!newReview.avatar && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="avatarInitials">Iniciais Customizadas</Label>
                        <Input
                          id="avatarInitials"
                          value={newReview.avatarInitials}
                          onChange={(e) => setNewReview({...newReview, avatarInitials: e.target.value.toUpperCase().substring(0, 2)})}
                          placeholder={generateInitials(newReview.nome)}
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label>Cor do Avatar</Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {avatarColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setNewReview({...newReview, avatarColor: color.value})}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                newReview.avatarColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preview do Avatar */}
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      <span className="text-sm text-gray-600">Preview:</span>
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: newReview.avatarColor }}
                      >
                        {newReview.avatarInitials || generateInitials(newReview.nome)}
                      </div>
                      <span className="text-sm text-gray-700">{newReview.nome}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-600 fill-current" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Geral</p>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <span className="text-3xl font-bold text-gray-900">{stats.mediaNotas}</span>
                  <div className="flex flex-col items-start">
                    <div className="flex">
                      {renderStars(Math.round(stats.mediaNotas), "w-4 h-4")}
                    </div>
                    <p className="text-xs text-gray-500">{stats.total} avaliações</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
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
                <Eye className="w-6 h-6 text-green-600" />
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
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inativos}</p>
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
                  placeholder="Buscar por nome ou comentário..."
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma avaliação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {renderAvatar(review)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{review.nome}</h3>
                            <div className="flex">
                              {renderStars(review.nota)}
                            </div>
                            {!review.ativo && (
                              <Badge variant="secondary">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 ml-13">{review.comentario}</p>
                      <div className="text-sm text-gray-600 ml-13 flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{review.tempoRelativo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingReview(review)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteReview(review.id)}
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
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Avaliação</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nome">Nome do Cliente *</Label>
                  <Input
                    id="edit-nome"
                    value={editingReview.nome}
                    onChange={(e) => setEditingReview({...editingReview, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nota">Nota *</Label>
                  <Select value={editingReview.nota.toString()} onValueChange={(value) => setEditingReview({...editingReview, nota: parseFloat(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(nota => (
                        <SelectItem key={nota} value={nota.toString()}>
                          <div className="flex items-center space-x-1">
                            <span>{nota}</span>
                            <div className="flex">
                              {renderStars(nota)}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-comentario">Comentário *</Label>
                <Textarea
                  id="edit-comentario"
                  value={editingReview.comentario}
                  onChange={(e) => setEditingReview({...editingReview, comentario: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-tempoRelativo">Tempo Relativo *</Label>
                <Input
                  id="edit-tempoRelativo"
                  value={editingReview.tempoRelativo}
                  onChange={(e) => setEditingReview({...editingReview, tempoRelativo: e.target.value})}
                  placeholder="Ex: 1 semana atrás, 3 dias atrás, 1 mês atrás"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este texto aparecerá como tempo da avaliação (ex: "1 semana atrás")
                </p>
              </div>

              {/* Avatar Configuration for Edit */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Configuração do Avatar
                </h4>
                
                <div>
                  <Label>Foto do Cliente (opcional)</Label>
                  <ImageUpload
                    value={editingReview.avatar ? [editingReview.avatar] : []}
                    onChange={(images) => setEditingReview({...editingReview, avatar: images[0] || ''})}
                    maxFiles={1}
                    maxSize={2}
                    className="mt-2"
                  />
                </div>

                {!editingReview.avatar && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Iniciais Customizadas</Label>
                        <Input
                          value={editingReview.avatarInitials || ''}
                          onChange={(e) => setEditingReview({...editingReview, avatarInitials: e.target.value.toUpperCase().substring(0, 2)})}
                          placeholder={generateInitials(editingReview.nome)}
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label>Cor do Avatar</Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {avatarColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setEditingReview({...editingReview, avatarColor: color.value})}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                (editingReview.avatarColor || '#3B82F6') === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-ativo"
                    checked={editingReview.ativo}
                    onCheckedChange={(checked) => setEditingReview({...editingReview, ativo: checked})}
                  />
                  <Label htmlFor="edit-ativo">Ativo</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingReview(null)}>
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

      {/* Modal de Edição de Estatísticas */}
      <Dialog open={isEditingStats} onOpenChange={setIsEditingStats}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estatísticas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-media">Média de Avaliações</Label>
              <Input
                id="edit-media"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={tempStats.mediaNotas}
                onChange={(e) => setTempStats({...tempStats, mediaNotas: parseFloat(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-500 mt-1">Valor entre 0.0 e 5.0</p>
            </div>
            
            <div>
              <Label htmlFor="edit-quantidade">Quantidade Total de Avaliações (público)</Label>
              <Input
                id="edit-quantidade"
                type="number"
                min="0"
                value={tempStats.quantidadeTotal}
                onChange={(e) => setTempStats({...tempStats, quantidadeTotal: parseInt(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Quantidade exibida publicamente (pode ser diferente do número real de reviews cadastrados)
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setTempStats({ mediaNotas: stats.mediaNotas, quantidadeTotal: stats.quantidadeTotal })
                  setIsEditingStats(false)
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  const finalStats = {
                    mediaNotas: Math.max(0, Math.min(5, tempStats.mediaNotas)),
                    quantidadeTotal: Math.max(0, tempStats.quantidadeTotal)
                  }
                  
                  // Salvar no banco
                  fetch('/api/reviews/stats', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalStats)
                  }).then(response => {
                    if (response.ok) {
                      setStats(prev => ({ ...prev, ...finalStats }))
                      setIsEditingStats(false)
                      toast.success('Estatísticas atualizadas com sucesso!')
                    } else {
                      toast.error('Erro ao salvar estatísticas')
                    }
                  }).catch(() => {
                    toast.error('Erro ao salvar estatísticas')
                  })
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminReviews 