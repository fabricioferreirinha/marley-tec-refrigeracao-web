import { NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()
  
  try {
    console.log(`[Keep-Alive] ${new Date().toISOString()} - Iniciando verificação...`)
    
    // Usar withRetry para garantir robustez
    const result = await withRetry(async () => {
      // 1. Ping básico no banco
      await prisma.$executeRaw`SELECT 1 as heartbeat`
      
      // 2. Verificar saúde das tabelas principais
      const [anunciosCount, reviewsCount, configsCount] = await Promise.all([
        prisma.anuncio.count().catch(() => 0),
        prisma.review.count().catch(() => 0),
        prisma.configuracao.count().catch(() => 0)
      ])
      
      return {
        anunciosCount,
        reviewsCount,
        configsCount,
        totalRecords: anunciosCount + reviewsCount + configsCount
      }
    })
    
    const executionTime = Date.now() - startTime
    
    const response = {
      status: 'alive',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      database: {
        connected: true,
        ...result
      },
      environment: process.env.NODE_ENV,
      keepAliveCount: await getKeepAliveCount(),
      message: '🟢 Supabase está ativo e funcionando!'
    }
    
    console.log(`[Keep-Alive] ✅ Sucesso em ${executionTime}ms - Total de registros: ${result.totalRecords}`)
    
    // Incrementar contador de keep-alive (para monitoramento)
    await incrementKeepAliveCount()
    
    return NextResponse.json(response)
    
  } catch (error) {
    const executionTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    console.error(`[Keep-Alive] ❌ Falha em ${executionTime}ms:`, errorMessage)
    
    // Resposta de erro estruturada
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      error: errorMessage,
      database: {
        connected: false
      },
      environment: process.env.NODE_ENV,
      message: '🔴 Problema detectado no Supabase!'
    }
    
    // Retornar erro 500 para alertar sistemas de monitoramento
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Função para contabilizar execuções do keep-alive
async function getKeepAliveCount(): Promise<number> {
  try {
    const config = await prisma.configuracao.findUnique({
      where: { chave: 'keep_alive_count' }
    })
    return config ? parseInt(config.valor) : 0
  } catch {
    return 0
  }
}

async function incrementKeepAliveCount(): Promise<void> {
  try {
    await prisma.configuracao.upsert({
      where: { chave: 'keep_alive_count' },
      update: { 
        valor: String((await getKeepAliveCount()) + 1),
        updatedAt: new Date()
      },
      create: {
        chave: 'keep_alive_count',
        valor: '1',
        descricao: 'Contador de execuções do keep-alive'
      }
    })
  } catch (error) {
    // Silencioso em caso de erro, não é crítico
    console.log('[Keep-Alive] Info: não foi possível atualizar contador')
  }
}

// Permitir execução manual via GET
export const dynamic = 'force-dynamic' 