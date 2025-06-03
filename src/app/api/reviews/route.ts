import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, executeWithFreshClient } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Reviews API] Buscando reviews...')
    
    const { searchParams } = new URL(request.url)
    const ativo = searchParams.get('ativo')
    const limit = searchParams.get('limit')

    const result = await withRetry(async () => {
      const where: any = {}
      
      if (ativo === 'true') {
        where.ativo = true
      }

      // Buscar total primeiro
      const totalReviews = await prisma.review.count({
        where: { ativo: true }
      })

      // Depois buscar reviews com paginação
      const reviews = await prisma.review.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: limit ? parseInt(limit) : undefined
      })

      // Calcular média manual para evitar problemas de aggregate
      const allActiveReviews = await prisma.review.findMany({
        where: { ativo: true },
        select: { nota: true }
      })

      const mediaNotas = allActiveReviews.length > 0 
        ? Number((allActiveReviews.reduce((sum, r) => sum + r.nota, 0) / allActiveReviews.length).toFixed(1))
        : 0

      // Calcular distribuição de notas manualmente
      const distribuicaoNotas = allActiveReviews.reduce((acc, review) => {
        acc[review.nota] = (acc[review.nota] || 0) + 1
        return acc
      }, {} as Record<number, number>)

      return {
        reviews,
        stats: {
          mediaNotas,
          totalReviews,
          distribuicaoNotas
        }
      }
    })

    console.log('✅ [Reviews API] Reviews encontrados:', result.reviews.length)
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ [Reviews API] Erro ao buscar reviews:', error)
    
    // Fallback com cliente fresh
    try {
      console.log('🚨 [Reviews API] Tentando com cliente fresh...')
      
      const { searchParams } = new URL(request.url)
      const ativo = searchParams.get('ativo')
      const limit = searchParams.get('limit')

      const result = await executeWithFreshClient(async (freshClient) => {
        const where: any = {}
        
        if (ativo === 'true') {
          where.ativo = true
        }

        const totalReviews = await freshClient.review.count({
          where: { ativo: true }
        })

        const reviews = await freshClient.review.findMany({
          where,
          orderBy: [
            { createdAt: 'desc' }
          ],
          take: limit ? parseInt(limit) : undefined
        })

        const allActiveReviews = await freshClient.review.findMany({
          where: { ativo: true },
          select: { nota: true }
        })

        const mediaNotas = allActiveReviews.length > 0 
          ? Number((allActiveReviews.reduce((sum, r) => sum + r.nota, 0) / allActiveReviews.length).toFixed(1))
          : 0

        const distribuicaoNotas = allActiveReviews.reduce((acc, review) => {
          acc[review.nota] = (acc[review.nota] || 0) + 1
          return acc
        }, {} as Record<number, number>)

        return {
          reviews,
          stats: {
            mediaNotas,
            totalReviews,
            distribuicaoNotas
          }
        }
      })

      console.log('✅ [Reviews API] Sucesso com cliente fresh')
      return NextResponse.json(result)
    } catch (freshError) {
      console.error('❌ [Reviews API] Erro mesmo com cliente fresh:', freshError)
      
      // Fallback com dados vazios mas estrutura correta
      const fallbackResult = {
        reviews: [],
        stats: {
          mediaNotas: 4.8,
          totalReviews: 0,
          distribuicaoNotas: {}
        }
      }
      
      console.log('🔄 [Reviews API] Usando fallback')
      return NextResponse.json(fallbackResult)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [Reviews API] Criando review...')
    
    const body = await request.json()
    
    const review = await withRetry(async () => {
      return await prisma.review.create({
        data: {
          nome: body.nome,
          avatar: body.avatar,
          avatarColor: body.avatarColor,
          avatarInitials: body.avatarInitials,
          nota: body.nota,
          comentario: body.comentario,
          tempoRelativo: body.tempoRelativo || '1 semana atrás',
          source: body.source || 'SITE'
        }
      })
    })

    console.log('✅ [Reviews API] Review criado com sucesso')
    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    console.error('❌ [Reviews API] Erro ao criar review:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao criar review',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
} 