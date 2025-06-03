"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Settings, Phone, Clock, Building, MapPin, Mail, Star, Save, RefreshCw } from 'lucide-react'

interface Configuracoes {
  telefone: string
  horario_funcionamento: string
  horario_emergencia: string
  cnpj: string
  endereco: string
  email: string
  google_review_url: string
  emergencia_24h: string
}

const AdminConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    telefone: '(21) 99749-6201',
    horario_funcionamento: 'Seg-Dom: 7h às 22h',
    horario_emergencia: 'Disponível 24h',
    cnpj: '37.481.212/0001-48',
    endereco: 'Maricá-RJ e Região',
    email: 'contato@marleytec.com.br',
    google_review_url: 'https://g.co/kgs/8DA9KGo',
    emergencia_24h: 'false'
  })
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchConfiguracoes()
  }, [])

  const fetchConfiguracoes = async () => {
    try {
      setFetching(true)
      const response = await fetch('/api/configuracoes')
      const data = await response.json()
      
      if (response.ok) {
        // Mesclar com valores padrão
        setConfiguracoes(prev => ({
          ...prev,
          ...data.configuracoes
        }))
      } else {
        toast.error('Erro ao carregar configurações')
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/configuracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configuracoes
        }),
      })
      
      if (response.ok) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: keyof Configuracoes, value: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const emergencia24h = configuracoes.emergencia_24h === 'true'

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Configurações do Site</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Configurações do Site</h2>
            <p className="text-gray-600">Gerencie informações de contato e funcionamento</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchConfiguracoes}
            disabled={fetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
            Recarregar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="telefone">Telefone/WhatsApp</Label>
              <Input
                id="telefone"
                value={configuracoes.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(21) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={configuracoes.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="endereco">Localização</Label>
              <Input
                id="endereco"
                value={configuracoes.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Cidade-Estado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horários de Funcionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Horários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="horario_funcionamento">Horário Normal</Label>
              <Input
                id="horario_funcionamento"
                value={configuracoes.horario_funcionamento}
                onChange={(e) => handleInputChange('horario_funcionamento', e.target.value)}
                placeholder="Seg-Sex: 8h às 18h"
              />
            </div>
            <div>
              <Label htmlFor="horario_emergencia">Emergência</Label>
              <Input
                id="horario_emergencia"
                value={configuracoes.horario_emergencia}
                onChange={(e) => handleInputChange('horario_emergencia', e.target.value)}
                placeholder="24h disponível"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="emergencia_24h"
                checked={emergencia24h}
                onCheckedChange={(checked) => 
                  handleInputChange('emergencia_24h', checked ? 'true' : 'false')
                }
              />
              <Label htmlFor="emergencia_24h">Mostrar "24h Emergência" no site</Label>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={configuracoes.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avaliações e Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="google_review_url">URL do Google para Avaliar</Label>
              <Input
                id="google_review_url"
                value={configuracoes.google_review_url}
                onChange={(e) => handleInputChange('google_review_url', e.target.value)}
                placeholder="https://g.co/kgs/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                URL onde clientes podem deixar avaliações no Google
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview das Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Preview das Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Contato</h4>
              <p className="text-sm text-gray-600">{configuracoes.telefone}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold">Horário</h4>
              <p className="text-sm text-gray-600">{configuracoes.horario_funcionamento}</p>
              {emergencia24h && (
                <p className="text-xs text-orange-600 font-medium">{configuracoes.horario_emergencia}</p>
              )}
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Localização</h4>
              <p className="text-sm text-gray-600">{configuracoes.endereco}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminConfiguracoes 