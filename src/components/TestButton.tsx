"use client"

import { ArrowRight } from 'lucide-react'

export default function TestButton() {
  const handleTest = async () => {
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      alert('✅ API funcionando: ' + JSON.stringify(data, null, 2))
    } catch (error) {
      alert('❌ Erro na API: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  return (
    <button
      onClick={handleTest}
      className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
    >
      <span>🧪 Testar API</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  )
} 