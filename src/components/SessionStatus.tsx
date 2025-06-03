"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Shield, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const SessionStatus = () => {
  const { isAdmin, renewSession } = useAuth()
  const [timeLeft, setTimeLeft] = useState(30)
  
  useEffect(() => {
    if (!isAdmin) return
    
    const interval = setInterval(() => {
      // Simulação do tempo restante (seria calculado baseado na última atividade)
      setTimeLeft(prev => {
        if (prev <= 1) return 30 // Reset para demonstração
        return prev - 1
      })
    }, 60000) // Atualizar a cada minuto
    
    return () => clearInterval(interval)
  }, [isAdmin])
  
  if (!isAdmin) return null
  
  const getStatusColor = () => {
    if (timeLeft > 15) return 'bg-green-500'
    if (timeLeft > 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getStatusText = () => {
    if (timeLeft > 15) return 'Ativa'
    if (timeLeft > 5) return 'Aviso'
    return 'Crítica'
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Sessão Admin</span>
        </div>
        
        <Badge 
          className={`${getStatusColor()} text-white text-xs`}
        >
          {getStatusText()}
        </Badge>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{timeLeft}min</span>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={renewSession}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Renovar
        </Button>
      </div>
    </div>
  )
}

export default SessionStatus 