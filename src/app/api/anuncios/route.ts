import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, executeWithFreshClient } from '@/lib/prisma'

// GET - Listar todos os anúncios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')
    const categoria = searchParams.get('categoria')
    const condicao = searchParams.get('condicao')
    const minPreco = searchParams.get('minPreco')
    const maxPreco = searchParams.get('maxPreco')
    const destaque = searchParams.get('destaque')
    
    // Usar withRetry para operações de banco de dados
    const result = await withRetry(async () => {
      // Construir filtros WHERE
      const where: any = {}
      
      // Filtro de status
      if (status && status !== 'TODOS') {
        where.status = status
      } else {
        where.status = 'ATIVO' // Default para anúncios ativos
      }
      
      // Filtro de busca por título e descrição
      if (search && search.trim()) {
        where.OR = [
          { titulo: { contains: search.trim(), mode: 'insensitive' } },
          { descricao: { contains: search.trim(), mode: 'insensitive' } },
          { referencia: { contains: search.trim(), mode: 'insensitive' } }
        ]
      }
      
      // Filtro de categoria
      if (categoria && categoria !== 'TODOS') {
        where.categoria = categoria
      }
      
      // Filtro de condição
      if (condicao && condicao !== 'TODOS') {
        where.condicao = condicao
      }
      
      // Filtro de faixa de preço
      if (minPreco || maxPreco) {
        where.preco = {}
        if (minPreco) where.preco.gte = parseFloat(minPreco)
        if (maxPreco) where.preco.lte = parseFloat(maxPreco)
      }
      
      // Filtro de destaque
      if (destaque === 'true') {
        where.destaque = true
      }

      // Contar total de itens para paginação
      const totalItems = await prisma.anuncio.count({ where })
      
      // Calcular paginação
      const skip = (page - 1) * limit
      const totalPages = Math.ceil(totalItems / limit)
      
      // Buscar anúncios com filtros e paginação
      const anuncios = await prisma.anuncio.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { destaque: 'desc' }, // Anúncios em destaque primeiro
          { createdAt: 'desc' }
        ]
      })

      return {
        anuncios,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    
    // Se o erro persistir, tentar com conexão fresca
    if (error instanceof Error && error.message.includes('prepared statement')) {
      try {
        console.log('🚨 Tentando com conexão fresca devido a erro de prepared statement')
        
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '12')
        const page = parseInt(searchParams.get('page') || '1')
        const search = searchParams.get('search')
        const categoria = searchParams.get('categoria')
        const condicao = searchParams.get('condicao')
        const minPreco = searchParams.get('minPreco')
        const maxPreco = searchParams.get('maxPreco')
        const destaque = searchParams.get('destaque')
        
        const result = await executeWithFreshClient(async (freshClient) => {
          const where: any = {}
          
          if (status && status !== 'TODOS') {
            where.status = status
          } else {
            where.status = 'ATIVO'
          }
          
          if (search && search.trim()) {
            where.OR = [
              { titulo: { contains: search.trim(), mode: 'insensitive' } },
              { descricao: { contains: search.trim(), mode: 'insensitive' } },
              { referencia: { contains: search.trim(), mode: 'insensitive' } }
            ]
          }
          
          if (categoria && categoria !== 'TODOS') {
            where.categoria = categoria
          }
          
          if (condicao && condicao !== 'TODOS') {
            where.condicao = condicao
          }
          
          if (minPreco || maxPreco) {
            where.preco = {}
            if (minPreco) where.preco.gte = parseFloat(minPreco)
            if (maxPreco) where.preco.lte = parseFloat(maxPreco)
          }
          
          if (destaque === 'true') {
            where.destaque = true
          }

          const totalItems = await freshClient.anuncio.count({ where })
          const skip = (page - 1) * limit
          const totalPages = Math.ceil(totalItems / limit)
          
          const anuncios = await freshClient.anuncio.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
              { destaque: 'desc' },
              { createdAt: 'desc' }
            ]
          })

          return {
            anuncios,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems,
              itemsPerPage: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
            }
          }
        })
        
        return NextResponse.json(result)
      } catch (freshError) {
        console.error('Erro mesmo com conexão fresca:', freshError)
      }
    }
    
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

// POST - Criar novo anúncio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      titulo,
      descricao,
      preco,
      categoria,
      condicao,
      localizacao,
      imagens,
      contato,
      whatsappMessage,
      destaque
    } = body

    // Validações básicas
    if (!titulo || !descricao || !preco || !contato) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: titulo, descricao, preco, contato' },
        { status: 400 }
      )
    }

    // Usar withRetry para criação do anúncio
    const anuncio = await withRetry(async () => {
      // Gerar referência simples
      const referencia = `REF${Date.now()}`

      // Gerar mensagem padrão do WhatsApp se não fornecida
      const defaultWhatsappMessage = whatsappMessage || 
        `Olá! Tenho interesse no anúncio: ${titulo} - R$ ${preco}. Poderia me dar mais informações?`

      return await prisma.anuncio.create({
        data: {
          titulo,
          descricao,
          preco: parseFloat(preco),
          categoria: categoria || 'OUTROS',
          condicao: condicao || 'USADO',
          localizacao,
          imagens: imagens || [],
          contato,
          whatsappMessage: defaultWhatsappMessage,
          destaque: destaque || false,
          referencia
        }
      })
    })

    return NextResponse.json({ anuncio }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar anúncio:', error)
    
    // Fallback com conexão fresca para casos extremos
    if (error instanceof Error && error.message.includes('prepared statement')) {
      try {
        console.log('🚨 Tentando criação com conexão fresca')
        
        const body = await request.json()
        const {
          titulo,
          descricao,
          preco,
          categoria,
          condicao,
          localizacao,
          imagens,
          contato,
          whatsappMessage,
          destaque
        } = body

        const anuncio = await executeWithFreshClient(async (freshClient) => {
          const referencia = `REF${Date.now()}`
          const defaultWhatsappMessage = whatsappMessage || 
            `Olá! Tenho interesse no anúncio: ${titulo} - R$ ${preco}. Poderia me dar mais informações?`

          return await freshClient.anuncio.create({
            data: {
              titulo,
              descricao,
              preco: parseFloat(preco),
              categoria: categoria || 'OUTROS',
              condicao: condicao || 'USADO',
              localizacao,
              imagens: imagens || [],
              contato,
              whatsappMessage: defaultWhatsappMessage,
              destaque: destaque || false,
              referencia
            }
          })
        })

        return NextResponse.json({ anuncio }, { status: 201 })
      } catch (freshError) {
        console.error('Erro mesmo com conexão fresca na criação:', freshError)
      }
    }
    
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