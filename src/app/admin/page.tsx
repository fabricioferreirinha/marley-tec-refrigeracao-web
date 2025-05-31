"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Settings, 
  BarChart, 
  ShoppingBag,
  LogOut,
  Save,
  X,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Anuncio {
  id: string
  titulo: string
  descricao: string
  preco: number
  imagens: string[]
  status: 'ATIVO' | 'INATIVO' | 'ARQUIVADO'
  dataPublicacao: string
  contato: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  name?: string
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [filteredAnuncios, setFilteredAnuncios] = useState<Anuncio[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(false)
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
    imagens: [] as string[],
    contato: ''
  })

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth()
  }, [])

  // Filtrar anúncios
  useEffect(() => {
    let filtered = anuncios
    
    if (searchTerm) {
      filtered = filtered.filter(anuncio => 
        anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anuncio.descricao.toLowerCase().includes(searchTerm.toLowerCase())
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

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (token) {
        // Simular verificação de token (implementar verificação real depois)
        setIsAuthenticated(true)
        setCurrentUser({ id: '1', email: 'admin@marleytec.com', name: 'Admin' })
        await fetchAnuncios()
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('auth-token', data.token)
        setIsAuthenticated(true)
        setCurrentUser(data.user)
        await fetchAnuncios()
        toast.success('Login realizado com sucesso!')
      } else {
        toast.error(data.error || 'Erro no login')
      }
    } catch (error) {
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setIsAuthenticated(false)
    setCurrentUser(null)
    setAnuncios([])
  }

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('/api/anuncios')
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

  const handleCreateAnuncio = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnuncio)
      })
      
      if (response.ok) {
        await fetchAnuncios()
        setIsCreateModalOpen(false)
        setNewAnuncio({ titulo: '', descricao: '', preco: '', imagens: [], contato: '' })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAnuncio)
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
    if (!confirm('Tem certeza que deseja deletar este anúncio?')) return
    
    try {
      const response = await fetch(`/api/anuncios/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchAnuncios()
        toast.success('Anúncio deletado com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao deletar anúncio')
      }
    } catch (error) {
      toast.error('Erro ao deletar anúncio')
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
      case 'ARQUIVADO': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">🔐 Painel Administrativo</CardTitle>
            <p className="text-gray-600">Marley Tec</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
                  placeholder="admin@marleytec.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">🛠️ Marley Tec Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {currentUser?.name || currentUser?.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Arquivados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.arquivados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar anúncios..."
                    className="pl-10 md:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TODOS">Todos os Status</option>
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="ARQUIVADO">Arquivado</option>
                </select>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Anúncio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Anúncio</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateAnuncio} className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={newAnuncio.titulo}
                        onChange={(e) => setNewAnuncio(prev => ({...prev, titulo: e.target.value}))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={newAnuncio.descricao}
                        onChange={(e) => setNewAnuncio(prev => ({...prev, descricao: e.target.value}))}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="preco">Preço (R$)</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        value={newAnuncio.preco}
                        onChange={(e) => setNewAnuncio(prev => ({...prev, preco: e.target.value}))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contato">Contato</Label>
                      <Input
                        id="contato"
                        value={newAnuncio.contato}
                        onChange={(e) => setNewAnuncio(prev => ({...prev, contato: e.target.value}))}
                        placeholder="(21) 99999-9999"
                        required
                      />
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
          </CardContent>
        </Card>

        {/* Lista de Anúncios */}
        <div className="grid gap-6">
          {filteredAnuncios.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <ShoppingBag className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-gray-600">Crie seu primeiro anúncio ou ajuste os filtros de busca.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnuncios.map((anuncio) => (
              <Card key={anuncio.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{anuncio.titulo}</h3>
                        <Badge className={getStatusColor(anuncio.status)}>
                          {anuncio.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{anuncio.descricao}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="font-semibold text-green-600">
                          {formatPrice(anuncio.preco)}
                        </span>
                        <span>📞 {anuncio.contato}</span>
                        <span>📅 {new Date(anuncio.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAnuncio(anuncio)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAnuncio(anuncio.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Edição */}
        {editingAnuncio && (
          <Dialog open={!!editingAnuncio} onOpenChange={() => setEditingAnuncio(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Anúncio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateAnuncio} className="space-y-4">
                <div>
                  <Label htmlFor="edit-titulo">Título</Label>
                  <Input
                    id="edit-titulo"
                    value={editingAnuncio.titulo}
                    onChange={(e) => setEditingAnuncio(prev => prev ? {...prev, titulo: e.target.value} : null)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-descricao">Descrição</Label>
                  <Textarea
                    id="edit-descricao"
                    value={editingAnuncio.descricao}
                    onChange={(e) => setEditingAnuncio(prev => prev ? {...prev, descricao: e.target.value} : null)}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-preco">Preço (R$)</Label>
                  <Input
                    id="edit-preco"
                    type="number"
                    step="0.01"
                    value={editingAnuncio.preco}
                    onChange={(e) => setEditingAnuncio(prev => prev ? {...prev, preco: parseFloat(e.target.value)} : null)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editingAnuncio.status}
                    onChange={(e) => setEditingAnuncio(prev => prev ? {...prev, status: e.target.value as any} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="ARQUIVADO">Arquivado</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="edit-contato">Contato</Label>
                  <Input
                    id="edit-contato"
                    value={editingAnuncio.contato}
                    onChange={(e) => setEditingAnuncio(prev => prev ? {...prev, contato: e.target.value} : null)}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingAnuncio(null)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Gerenciar Anúncios */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-6xl mb-6">📢</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Gerenciar Anúncios</h3>
            <p className="text-gray-600 mb-6">
              Crie, edite e gerencie todos os seus anúncios de equipamentos.
            </p>
            <Link
              href="/admin/anuncios"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Acessar Anúncios
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Gerenciar Reviews - NOVO */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-500">
            <div className="text-6xl mb-6">⭐</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Gerenciar Reviews</h3>
            <p className="text-gray-600 mb-6">
              Adicione e gerencie as avaliações dos clientes que aparecem no site.
            </p>
            <Link
              href="/admin/reviews"
              className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
            >
              Gerenciar Reviews
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Configurações */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-6xl mb-6">⚙️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Configurações</h3>
            <p className="text-gray-600 mb-6">
              Altere informações do site, contato e outras configurações.
            </p>
            <Link
              href="/admin/configuracoes"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
            >
              Configurações
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 