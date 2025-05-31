import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id }
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
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        nome: body.nome,
        avatar: body.avatar,
        nota: body.nota,
        comentario: body.comentario,
        servico: body.servico,
        dataServico: body.dataServico ? new Date(body.dataServico) : null,
        destacado: body.destacado,
        ativo: body.ativo !== undefined ? body.ativo : true,
        source: body.source || 'GOOGLE'
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Erro ao atualizar review:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Review excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir review:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir review' },
      { status: 500 }
    )
  }
} 