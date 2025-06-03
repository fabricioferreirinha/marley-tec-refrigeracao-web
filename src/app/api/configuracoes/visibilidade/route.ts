import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

// Configurações padrão caso a API falhe
const DEFAULT_CONFIG = {
  carouselAtivo: true,
  paginaAtivo: true
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Visibilidade API] Buscando configurações de visibilidade...')
    
    const configuracoes = await withRetry(async () => {
      return await prisma.configuracao.findMany({
        where: {
          chave: {
            in: ['classificados_carousel_ativo', 'classificados_pagina_ativo']
          }
        }
      })
    })
    
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
    console.warn('⚠️ [Visibilidade API] Erro de conexão PostgreSQL, retornando configuração padrão')
    
    // Fallback robusto
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

// Configuração para tornar a rota dinâmica
export const dynamic = 'force-dynamic'
export const revalidate = 0 