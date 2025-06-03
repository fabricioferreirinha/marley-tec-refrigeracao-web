import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Criar instância única do Prisma com melhor configuração
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'minimal',
})

// Configurações padrão caso a API falhe
const DEFAULT_CONFIG = {
  carouselAtivo: true,
  paginaAtivo: true
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Visibilidade API] Buscando configurações de visibilidade...')
    
    // Timeout para a query
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 8000)
    )
    
    const queryPromise = prisma.configuracao.findMany({
      where: {
        chave: {
          in: ['classificados_carousel_ativo', 'classificados_pagina_ativo']
        }
      }
    })

    const configuracoes = await Promise.race([queryPromise, timeoutPromise]) as any[]
    
    console.log(`✅ [Visibilidade API] Configurações encontradas:`, configuracoes.map(c => ({ chave: c.chave, valor: c.valor })))

    const carouselConfig = configuracoes.find(c => c.chave === 'classificados_carousel_ativo')
    const paginaConfig = configuracoes.find(c => c.chave === 'classificados_pagina_ativo')

    const visibilidade = {
      carouselAtivo: carouselConfig ? carouselConfig.valor === 'true' : true,
      paginaAtivo: paginaConfig ? paginaConfig.valor === 'true' : true
    }

    console.log(`✅ [Visibilidade API] Visibilidade retornada:`, visibilidade)
    return NextResponse.json(visibilidade)
    
  } catch (error) {
    console.error('❌ [Visibilidade API] Erro ao buscar configurações:', error)
    
    // Se for erro de conexão PostgreSQL, retornar configuração padrão
    if (error.message?.includes('connection') || 
        error.message?.includes('timeout') || 
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('prepared statement')) {
      
      console.log('⚠️ [Visibilidade API] Erro de conexão PostgreSQL, retornando configuração padrão')
      return NextResponse.json(DEFAULT_CONFIG)
    }
    
    // Para outros erros, também retornar configuração padrão mas com status 200
    // para não quebrar a interface do usuário
    console.log('⚠️ [Visibilidade API] Erro genérico, retornando configuração padrão')
    return NextResponse.json(DEFAULT_CONFIG)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { carouselAtivo, paginaAtivo } = await request.json()

    console.log('🔄 [Visibilidade API] Atualizando configurações:', { carouselAtivo, paginaAtivo })

    // Timeout para as operações de update
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    )

    const updatePromise = async () => {
      // Atualizar ou criar configuração do carousel
      await prisma.configuracao.upsert({
        where: { chave: 'classificados_carousel_ativo' },
        update: { valor: carouselAtivo.toString() },
        create: { 
          chave: 'classificados_carousel_ativo', 
          valor: carouselAtivo.toString() 
        }
      })

      // Atualizar ou criar configuração da página
      await prisma.configuracao.upsert({
        where: { chave: 'classificados_pagina_ativo' },
        update: { valor: paginaAtivo.toString() },
        create: { 
          chave: 'classificados_pagina_ativo', 
          valor: paginaAtivo.toString() 
        }
      })
    }

    await Promise.race([updatePromise(), timeoutPromise])
    
    console.log('✅ [Visibilidade API] Configurações atualizadas com sucesso')
    return NextResponse.json({ 
      success: true,
      message: 'Configurações de visibilidade atualizadas com sucesso' 
    })
    
  } catch (error) {
    console.error('❌ [Visibilidade API] Erro ao atualizar configurações:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar as configurações. Tente novamente.'
      },
      { status: 500 }
    )
  }
}

// Função para limpar conexões quando necessário
export async function cleanup() {
  await prisma.$disconnect()
} 