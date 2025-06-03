import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '6')

    const where = active === 'true' ? { status: 'ATIVO' } : {}

    const classifiedAds = await prisma.anuncio.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(classifiedAds)
  } catch (error) {
    console.error('Erro ao buscar classificados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 