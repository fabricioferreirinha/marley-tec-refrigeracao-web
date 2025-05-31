"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CheckCircle, Database, User, ShoppingBag } from 'lucide-react'

const SetupPage = () => {
  const [loading, setLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [setupData, setSetupData] = useState<any>(null)

  const runSetup = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSetupData(data)
        setSetupComplete(true)
        toast.success('Banco de dados configurado com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao configurar banco')
      }
    } catch (error) {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              🎉 Setup Concluído com Sucesso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                ✅ O que foi configurado:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Usuário Admin</p>
                    <p className="text-sm text-gray-600">admin@marleytec.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Anúncios Exemplo</p>
                    <p className="text-sm text-gray-600">{setupData?.adsCreated} criados</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Banco de Dados</p>
                    <p className="text-sm text-gray-600">Configurado e populado</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">APIs</p>
                    <p className="text-sm text-gray-600">Todas funcionando</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                🔑 Credenciais de Acesso:
              </h3>
              <div className="bg-white p-4 rounded border font-mono text-sm">
                <p><strong>Email:</strong> admin@marleytec.com</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="flex-1"
              >
                <a href="/">🏠 Ir para o Site</a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="flex-1"
              >
                <a href="/admin">🛠️ Painel Admin</a>
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Agora seu site Marley Tec está pronto para uso! 🚀</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Database className="w-16 h-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">🚀 Setup Marley Tec</CardTitle>
          <p className="text-gray-600">
            Configure o banco de dados e dados iniciais do seu site
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">O que será configurado:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Usuário administrador padrão</li>
              <li>• Anúncios de exemplo para o site</li>
              <li>• Configurações básicas</li>
              <li>• Estrutura do banco de dados</li>
            </ul>
          </div>
          
          <Button 
            onClick={runSetup} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Executar Setup
              </>
            )}
          </Button>
          
          <div className="text-center text-xs text-gray-500">
            <p>Este processo é seguro e pode ser executado várias vezes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupPage 