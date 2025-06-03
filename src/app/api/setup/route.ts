import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'
import { Categoria, Condicao, Status } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Usar withRetry para verificar dados existentes
    const existingData = await withRetry(async () => {
      return await prisma.anuncio.count()
    })
    
    if (existingData > 0) {
      return NextResponse.json({ 
        message: 'Dados já existem',
        count: existingData 
      })
    }

    // Se não há dados, criar alguns dados de exemplo
    const anunciosData = [
      {
        titulo: 'Geladeira Brastemp 420L',
        descricao: 'Geladeira duplex em excelente estado, funcionando perfeitamente.',
        preco: 800.00,
        categoria: Categoria.GELADEIRA,
        condicao: Condicao.SEMINOVO,
        localizacao: 'Rio de Janeiro, RJ',
        contato: '(21) 99999-9999',
        whatsappMessage: 'Olá! Tenho interesse na geladeira Brastemp.',
        destaque: true,
        referencia: 'REF2024001',
        status: Status.ATIVO,
        imagens: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400']
      },
      {
        titulo: 'Máquina de Lavar Consul 11kg',
        descricao: 'Máquina automática, todas as funções funcionando perfeitamente.',
        preco: 600.00,
        categoria: Categoria.MAQUINA_LAVAR,
        condicao: Condicao.USADO,
        localizacao: 'Rio de Janeiro, RJ',
        contato: '(21) 99999-9999',
        whatsappMessage: 'Olá! Tenho interesse na máquina de lavar.',
        destaque: false,
        referencia: 'REF2024002',
        status: Status.ATIVO,
        imagens: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400']
      }
    ]

    // Criar anúncios usando withRetry
    const createdCount = await withRetry(async () => {
      let count = 0
      for (const anuncioData of anunciosData) {
        await prisma.anuncio.create({
          data: anuncioData
        })
        count++
      }
      return count
    })

    return NextResponse.json({ 
      message: 'Setup realizado com sucesso!',
      created: createdCount 
    })

  } catch (error) {
    console.error('Erro no setup:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 