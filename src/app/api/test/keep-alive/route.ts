import { NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()
  
  try {
    console.log(`[Test Keep-Alive] ${new Date().toISOString()} - Testando conexão...`)
    
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
    
    // Verificar contador de keep-alive
    const keepAliveCount = await getKeepAliveCount()
    
    const response = {
      status: 'alive',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      database: {
        connected: true,
        ...result
      },
      environment: process.env.NODE_ENV,
      keepAliveCount,
      cronConfig: {
        schedule: "0 */6 * * *", // A cada 6 horas
        lastExecution: await getLastKeepAliveExecution()
      },
      message: '🟢 Teste: Supabase está ativo e funcionando!'
    }
    
    console.log(`[Test Keep-Alive] ✅ Sucesso em ${executionTime}ms - Total de registros: ${result.totalRecords}`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    const executionTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    console.error(`[Test Keep-Alive] ❌ Falha em ${executionTime}ms:`, errorMessage)
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      error: errorMessage,
      database: {
        connected: false
      },
      environment: process.env.NODE_ENV,
      message: '🔴 Teste: Problema detectado no Supabase!'
    }
    
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

// Função para obter última execução
async function getLastKeepAliveExecution(): Promise<string | null> {
  try {
    const config = await prisma.configuracao.findUnique({
      where: { chave: 'keep_alive_last_execution' }
    })
    return config ? config.valor : null
  } catch {
    return null
  }
}