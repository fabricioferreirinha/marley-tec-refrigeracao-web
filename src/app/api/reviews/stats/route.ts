import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, executeWithFreshClient } from '@/lib/prisma'

// GET - Buscar estatísticas editáveis
export async function GET() {
  try {
    console.log('🔍 [Stats API] Buscando estatísticas editáveis...')
    
    const result = await withRetry(async () => {
      // Buscar configurações do banco de dados
      const mediaConfig = await prisma.configuracao.findUnique({
        where: { chave: 'reviews_media_notas' }
      })
      
      const quantidadeConfig = await prisma.configuracao.findUnique({
        where: { chave: 'reviews_quantidade_total' }
      })

      console.log('📊 [Stats API] Configurações encontradas:', {
        media: mediaConfig?.valor,
        quantidade: quantidadeConfig?.valor
      })

      return {
        mediaNotas: mediaConfig ? parseFloat(mediaConfig.valor) : 4.8,
        quantidadeTotal: quantidadeConfig ? parseInt(quantidadeConfig.valor) : 127
      }
    })

    console.log('✅ [Stats API] Estatísticas retornadas:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ [Stats API] Erro ao buscar estatísticas:', error)
    
    // Fallback com cliente fresh em caso de erro persistente
    try {
      console.log('🚨 [Stats API] Tentando com cliente fresh...')
      
      const result = await executeWithFreshClient(async (freshClient) => {
        const mediaConfig = await freshClient.configuracao.findUnique({
          where: { chave: 'reviews_media_notas' }
        })
        
        const quantidadeConfig = await freshClient.configuracao.findUnique({
          where: { chave: 'reviews_quantidade_total' }
        })

        return {
          mediaNotas: mediaConfig ? parseFloat(mediaConfig.valor) : 4.8,
          quantidadeTotal: quantidadeConfig ? parseInt(quantidadeConfig.valor) : 127
        }
      })
      
      console.log('✅ [Stats API] Sucesso com cliente fresh:', result)
      return NextResponse.json(result)
    } catch (freshError) {
      console.error('❌ [Stats API] Erro mesmo com cliente fresh:', freshError)
      
      // Fallback com valores padrão em caso de erro
      const fallbackStats = {
        mediaNotas: 4.8,
        quantidadeTotal: 127
      }
      
      console.log('🔄 [Stats API] Usando fallback:', fallbackStats)
      return NextResponse.json(fallbackStats)
    }
  }
}

// PUT - Atualizar estatísticas editáveis
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 [Stats API] Atualizando estatísticas...')
    
    const { mediaNotas, quantidadeTotal } = await request.json()
    console.log('📝 [Stats API] Dados recebidos:', { mediaNotas, quantidadeTotal })

    // Validar os dados
    const validMediaNotas = Math.max(0, Math.min(5, parseFloat(mediaNotas) || 4.8))
    const validQuantidadeTotal = Math.max(0, parseInt(quantidadeTotal) || 127)

    console.log('✅ [Stats API] Dados validados:', { validMediaNotas, validQuantidadeTotal })

    const result = await withRetry(async () => {
      // Atualizar ou criar a configuração da média de notas
      await prisma.configuracao.upsert({
        where: { chave: 'reviews_media_notas' },
        update: { 
          valor: validMediaNotas.toString(),
          updatedAt: new Date()
        },
        create: {
          chave: 'reviews_media_notas',
          valor: validMediaNotas.toString(),
          descricao: 'Média de avaliações exibida publicamente'
        }
      })

      // Atualizar ou criar a configuração da quantidade total
      await prisma.configuracao.upsert({
        where: { chave: 'reviews_quantidade_total' },
        update: { 
          valor: validQuantidadeTotal.toString(),
          updatedAt: new Date()
        },
        create: {
          chave: 'reviews_quantidade_total',
          valor: validQuantidadeTotal.toString(),
          descricao: 'Quantidade total de avaliações exibida publicamente'
        }
      })

      return {
        mediaNotas: validMediaNotas,
        quantidadeTotal: validQuantidadeTotal
      }
    })

    console.log('✅ [Stats API] Estatísticas atualizadas com sucesso:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ [Stats API] Erro ao atualizar estatísticas:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    )
  }
} 