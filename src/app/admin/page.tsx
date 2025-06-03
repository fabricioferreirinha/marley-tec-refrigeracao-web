"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  LogOut, 
  User, 
  Settings, 
  BarChart, 
  ShoppingBag,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  Users,
  Star
} from 'lucide-react'
import AdminClassifieds from '@/components/AdminClassifieds'
import AdminReviews from '@/components/AdminReviews'
import AdminUsers from '@/components/AdminUsers'
import { useAuth } from '@/lib/auth'

// Componente de Loading
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Verificando autenticação...</p>
      </div>
    </div>
  )
}

// Componente de Login (SEM cadastro público)
function LoginForm() {
  const { signIn, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (!formData.email || !formData.password) {
      setLoginError('Por favor, preencha todos os campos')
      return
    }

    const result = await signIn(formData.email, formData.password)
    
    if (!result.success) {
      setLoginError(result.error || 'Erro desconhecido')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Área Administrativa
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Marley-Tec Refrigeração
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@marleytec.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-2">
              🔒 Acesso Restrito
            </p>
            <p className="text-xs text-blue-600">
              Apenas administradores autorizados podem acessar este painel. 
              Para criar novos usuários, entre em contato com um administrador.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente do Dashboard Admin
function AdminDashboard() {
  const { user, signOut, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    totalAnuncios: 0,
    anunciosAtivos: 0,
    totalReviews: 0,
    mediaAvaliacoes: 0
  })
  
  const [activeTab, setActiveTab] = useState('classificados')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Buscar estatísticas dos anúncios
      const anunciosResponse = await fetch('/api/anuncios?status=TODOS')
      if (anunciosResponse.ok) {
        const anunciosData = await anunciosResponse.json()
        const total = anunciosData.total || 0
        const ativos = anunciosData.anuncios?.filter((a: any) => a.status === 'ATIVO').length || 0
        
        setStats(prev => ({
          ...prev,
          totalAnuncios: total,
          anunciosAtivos: ativos
        }))
      }

      // Buscar estatísticas das reviews
      const reviewsResponse = await fetch('/api/reviews/stats')
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        setStats(prev => ({
          ...prev,
          totalReviews: reviewsData.quantidade || 0,
          mediaAvaliacoes: reviewsData.media || 0
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta área.
            </p>
            <Button onClick={handleLogout} variant="outline">
              Fazer Logout
            </Button>
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Marley-Tec Refrigeração</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Principal - Substituindo os pequenos cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Menu Classificados */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
              activeTab === 'classificados' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleTabChange('classificados')}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                  activeTab === 'classificados' ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  <ShoppingBag className={`w-8 h-8 ${
                    activeTab === 'classificados' ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Classificados</h3>
                  <p className="text-sm text-gray-600 mb-4">Gerencie anúncios de eletrodomésticos</p>
                  
                  <div className="bg-white rounded-lg p-4 border space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Criar, editar e excluir anúncios</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Settings className="w-4 h-4 text-green-500" />
                      <span>Controlar visibilidade no site</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <span className={`text-sm font-medium ${
                    activeTab === 'classificados' ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {activeTab === 'classificados' ? '● Ativo' : 'Clique para acessar'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Avaliações */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
              activeTab === 'reviews' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
            }`}
            onClick={() => handleTabChange('reviews')}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                  activeTab === 'reviews' ? 'bg-yellow-500' : 'bg-yellow-100'
                }`}>
                  <BarChart className={`w-8 h-8 ${
                    activeTab === 'reviews' ? 'text-white' : 'text-yellow-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Avaliações</h3>
                  <p className="text-sm text-gray-600 mb-4">Gerencie reviews e feedbacks</p>
                  
                  <div className="bg-white rounded-lg p-4 border space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Criar e editar avaliações</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <BarChart className="w-4 h-4 text-green-500" />
                      <span>Configurar estatísticas exibidas</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <span className={`text-sm font-medium ${
                    activeTab === 'reviews' ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {activeTab === 'reviews' ? '● Ativo' : 'Clique para acessar'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Usuários */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
              activeTab === 'users' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
            }`}
            onClick={() => handleTabChange('users')}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                  activeTab === 'users' ? 'bg-purple-500' : 'bg-purple-100'
                }`}>
                  <Users className={`w-8 h-8 ${
                    activeTab === 'users' ? 'text-white' : 'text-purple-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Usuários</h3>
                  <p className="text-sm text-gray-600 mb-4">Controle de acesso e permissões</p>
                  
                  <div className="bg-white rounded-lg p-4 border space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-purple-500" />
                      <span>Gerenciar administradores</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span>Controlar permissões de acesso</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <span className={`text-sm font-medium ${
                    activeTab === 'users' ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {activeTab === 'users' ? '● Ativo' : 'Clique para acessar'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {activeTab === 'classificados' && <AdminClassifieds />}
          {activeTab === 'reviews' && <AdminReviews />}
          {activeTab === 'users' && <AdminUsers />}
        </div>
      </main>
    </div>
  )
}

// Componente Principal Exportado
export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || !isAdmin) {
    return <LoginForm />
  }

  return <AdminDashboard />
} 