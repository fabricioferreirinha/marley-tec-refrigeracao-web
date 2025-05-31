"use client"

import React, { useState, useEffect } from 'react'
import { Star, Plus, Edit, Trash2, Save, X, Award, Calendar, User } from 'lucide-react'

interface Review {
  id: string
  nome: string
  avatar?: string
  nota: number
  comentario: string
  servico?: string
  dataServico?: string
  destacado: boolean
  source: string
  ativo: boolean
  createdAt: string
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    avatar: '',
    nota: 5,
    comentario: '',
    servico: '',
    dataServico: '',
    destacado: false,
    source: 'GOOGLE'
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Erro ao buscar reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingReview ? 'PUT' : 'POST'
      const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchReviews()
        resetForm()
        alert(editingReview ? 'Review atualizado!' : 'Review criado!')
      } else {
        alert('Erro ao salvar review')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar review')
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setFormData({
      nome: review.nome,
      avatar: review.avatar || '',
      nota: review.nota,
      comentario: review.comentario,
      servico: review.servico || '',
      dataServico: review.dataServico || '',
      destacado: review.destacado,
      source: review.source
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este review?')) return

    try {
      const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchReviews()
        alert('Review excluído!')
      } else {
        alert('Erro ao excluir review')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir review')
    }
  }

  const toggleActive = async (review: Review) => {
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, ativo: !review.ativo })
      })

      if (response.ok) {
        await fetchReviews()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      avatar: '',
      nota: 5,
      comentario: '',
      servico: '',
      dataServico: '',
      destacado: false,
      source: 'GOOGLE'
    })
    setEditingReview(null)
    setShowForm(false)
  }

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={interactive && onChange ? () => onChange(index + 1) : undefined}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <Award className="inline w-8 h-8 mr-3 text-blue-600" />
                Gerenciar Reviews
              </h1>
              <p className="text-gray-600">
                Total: {reviews.length} reviews • Ativos: {reviews.filter(r => r.ativo).length}
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Review
            </button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingReview ? 'Editar Review' : 'Novo Review'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Avatar (URL ou Iniciais)
                    </label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: JS ou https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Avaliação *
                  </label>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.nota, true, (rating) => 
                      setFormData({ ...formData, nota: rating })
                    )}
                    <span className="ml-3 text-lg font-bold text-gray-700">
                      {formData.nota}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Comentário *
                  </label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Depoimento do cliente..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tipo de Serviço
                    </label>
                    <select
                      value={formData.servico}
                      onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="Conserto de Geladeira">Conserto de Geladeira</option>
                      <option value="Conserto de Ar-condicionado">Conserto de Ar-condicionado</option>
                      <option value="Instalação de Ar-condicionado">Instalação de Ar-condicionado</option>
                      <option value="Conserto de Máquina de Lavar">Conserto de Máquina de Lavar</option>
                      <option value="Conserto de Fogão">Conserto de Fogão</option>
                      <option value="Conserto de Microondas">Conserto de Microondas</option>
                      <option value="Conserto de Freezer">Conserto de Freezer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Data do Serviço
                    </label>
                    <input
                      type="date"
                      value={formData.dataServico}
                      onChange={(e) => setFormData({ ...formData, dataServico: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      formData.destacado ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {formData.destacado && <Star className="w-4 h-4 text-white fill-current" />}
                    </div>
                    <span className="ml-3 font-medium text-gray-700">Review em Destaque</span>
                  </label>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Origem
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="GOOGLE">Google</option>
                      <option value="SITE">Site</option>
                      <option value="WHATSAPP">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingReview ? 'Atualizar' : 'Salvar'} Review
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                !review.ativo ? 'opacity-50' : ''
              } ${review.destacado ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {review.avatar && review.avatar.startsWith('http') ? (
                      <img
                        src={review.avatar}
                        alt={review.nome}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      review.avatar || review.nome.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.nome}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(review.nota)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.destacado && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ⭐ DESTAQUE
                    </div>
                  )}
                  {!review.ativo && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      INATIVO
                    </div>
                  )}
                </div>
              </div>

              {/* Comentário */}
              <p className="text-gray-700 italic mb-4 line-clamp-3">
                "{review.comentario}"
              </p>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                {review.servico && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{review.servico}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(review)}
                  className={`flex-1 inline-flex items-center justify-center px-3 py-2 font-medium rounded-lg transition-colors ${
                    review.ativo
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {review.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum review encontrado</h3>
            <p className="text-gray-500 mb-6">Comece adicionando seu primeiro review!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews 