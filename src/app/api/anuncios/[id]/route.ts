import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

// GET - Buscar anúncio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const anuncio = await withRetry(async () => {
      return await prisma.anuncio.findUnique({
        where: { id }
      })
    })

    if (!anuncio) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(anuncio)
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error)
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

// PUT - Atualizar anúncio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      destaque,
      status
    } = body

    const anuncio = await withRetry(async () => {
      // Verificar se o anúncio existe
      const existingAnuncio = await prisma.anuncio.findUnique({
        where: { id }
      })

      if (!existingAnuncio) {
        throw new Error('Anúncio não encontrado')
      }

      // Atualizar anúncio
      return await prisma.anuncio.update({
        where: { id },
        data: {
          titulo,
          descricao,
          preco: parseFloat(preco),
          categoria,
          condicao,
          localizacao,
          imagens,
          contato,
          whatsappMessage,
          destaque,
          status
        }
      })
    })

    return NextResponse.json(anuncio)
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error)
    
    if (error instanceof Error && error.message === 'Anúncio não encontrado') {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
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

// DELETE - Deletar anúncio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await withRetry(async () => {
      // Verificar se o anúncio existe
      const existingAnuncio = await prisma.anuncio.findUnique({
        where: { id }
      })

      if (!existingAnuncio) {
        throw new Error('Anúncio não encontrado')
      }

      // Deletar anúncio
      await prisma.anuncio.delete({
        where: { id }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error)
    
    if (error instanceof Error && error.message === 'Anúncio não encontrado') {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
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