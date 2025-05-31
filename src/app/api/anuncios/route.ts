import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Listar todos os anúncios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status: status as any } : {}

    const anuncios = await prisma.anuncio.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.anuncio.count({ where })

    return NextResponse.json({
      anuncios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo anúncio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, descricao, preco, imagens, contato } = body

    if (!titulo || !descricao || !preco || !contato) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: titulo, descricao, preco, contato' },
        { status: 400 }
      )
    }

    const anuncio = await prisma.anuncio.create({
      data: {
        titulo,
        descricao,
        preco: parseFloat(preco),
        imagens: imagens || [],
        contato,
        status: 'ATIVO'
      }
    })

    return NextResponse.json(anuncio, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 