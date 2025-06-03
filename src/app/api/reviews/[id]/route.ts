import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

// GET - Buscar review por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await withRetry(async () => {
      return await prisma.review.findUnique({
        where: { id: params.id }
      })
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Erro ao buscar review:', error)
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

// PUT - Atualizar review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const review = await withRetry(async () => {
      // Verificar se o review existe
      const existingReview = await prisma.review.findUnique({
        where: { id: params.id }
      })

      if (!existingReview) {
        throw new Error('Review não encontrado')
      }

      // Atualizar review
      return await prisma.review.update({
        where: { id: params.id },
        data: {
          nome: body.nome,
          avatar: body.avatar,
          avatarColor: body.avatarColor,
          avatarInitials: body.avatarInitials,
          nota: body.nota,
          comentario: body.comentario,
          tempoRelativo: body.tempoRelativo,
          ativo: body.ativo !== undefined ? body.ativo : true,
          source: body.source || 'SITE'
        }
      })
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Erro ao atualizar review:', error)
    
    if (error instanceof Error && error.message === 'Review não encontrado') {
      return NextResponse.json(
        { error: 'Review não encontrado' },
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

// DELETE - Deletar review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await withRetry(async () => {
      // Verificar se o review existe
      const existingReview = await prisma.review.findUnique({
        where: { id: params.id }
      })

      if (!existingReview) {
        throw new Error('Review não encontrado')
      }

      // Deletar review
      await prisma.review.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar review:', error)
    
    if (error instanceof Error && error.message === 'Review não encontrado') {
      return NextResponse.json(
        { error: 'Review não encontrado' },
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