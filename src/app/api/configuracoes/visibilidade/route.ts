import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const configuracoes = await prisma.configuracao.findMany({
      where: {
        chave: {
          in: ['classificados_carousel_ativo', 'classificados_pagina_ativo']
        }
      }
    })

    const carouselConfig = configuracoes.find(c => c.chave === 'classificados_carousel_ativo')
    const paginaConfig = configuracoes.find(c => c.chave === 'classificados_pagina_ativo')

    const visibilidade = {
      carouselAtivo: carouselConfig ? carouselConfig.valor === 'true' : true,
      paginaAtivo: paginaConfig ? paginaConfig.valor === 'true' : true
    }

    return NextResponse.json(visibilidade)
  } catch (error) {
    console.error('Erro ao buscar configurações de visibilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { carouselAtivo, paginaAtivo } = await request.json()

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

    return NextResponse.json({ 
      success: true,
      message: 'Configurações de visibilidade atualizadas com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao atualizar configurações de visibilidade:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 