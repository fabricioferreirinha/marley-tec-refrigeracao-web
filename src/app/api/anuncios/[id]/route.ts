import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar anúncio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const anuncio = await prisma.anuncio.findUnique({
      where: { id: params.id }
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
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar anúncio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { titulo, descricao, preco, imagens, status, contato } = body

    const anuncio = await prisma.anuncio.update({
      where: { id: params.id },
      data: {
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(preco && { preco: parseFloat(preco) }),
        ...(imagens && { imagens }),
        ...(status && { status }),
        ...(contato && { contato }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(anuncio)
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar anúncio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.anuncio.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Anúncio deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 