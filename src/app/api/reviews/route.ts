import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simulação de reviews do Google (em produção, seria integrado com Google My Business API)
const mockReviews = [
  {
    id: '1',
    author_name: 'Maria Silva',
    author_url: 'https://www.google.com/maps/contrib/123',
    language: 'pt',
    profile_photo_url: 'https://ui-avatars.com/api/?name=Maria+Silva&background=random',
    rating: 5,
    relative_time_description: 'há 1 semana',
    text: 'Excelente profissional! Consertou minha geladeira Brastemp rapidamente e com preço justo. Muito competente e pontual. Recomendo!',
    time: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    id: '2',
    author_name: 'João Santos',
    author_url: 'https://www.google.com/maps/contrib/456',
    language: 'pt',
    profile_photo_url: 'https://ui-avatars.com/api/?name=João+Santos&background=random',
    rating: 5,
    relative_time_description: 'há 2 semanas',
    text: 'Técnico muito atencioso e experiente. Resolveu o problema do meu ar condicionado Samsung no mesmo dia. Preço honesto e serviço de qualidade.',
    time: Date.now() - 14 * 24 * 60 * 60 * 1000
  },
  {
    id: '3',
    author_name: 'Ana Costa',
    author_url: 'https://www.google.com/maps/contrib/789',
    language: 'pt',
    profile_photo_url: 'https://ui-avatars.com/api/?name=Ana+Costa&background=random',
    rating: 5,
    relative_time_description: 'há 3 semanas',
    text: 'Serviço impecável! Consertou minha máquina de lavar Electrolux e ainda me deu dicas de manutenção. Técnico de confiança, com certeza chamarei novamente.',
    time: Date.now() - 21 * 24 * 60 * 60 * 1000
  },
  {
    id: '4',
    author_name: 'Carlos Oliveira',
    author_url: 'https://www.google.com/maps/contrib/101',
    language: 'pt',
    profile_photo_url: 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=random',
    rating: 5,
    relative_time_description: 'há 1 mês',
    text: 'Marley é um excelente técnico! Consertou meu micro-ondas LG que já estava desenganado. Trabalho limpo e organizado. Nota 10!',
    time: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: '5',
    author_name: 'Fernanda Lima',
    author_url: 'https://www.google.com/maps/contrib/111',
    language: 'pt',
    profile_photo_url: 'https://ui-avatars.com/api/?name=Fernanda+Lima&background=random',
    rating: 5,
    relative_time_description: 'há 1 mês',
    text: 'Profissional exemplar! Chegou no horário combinado e resolveu o problema da minha lava-louças Midea rapidamente. Muito educado e prestativo.',
    time: Date.now() - 35 * 24 * 60 * 60 * 1000
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ativo = searchParams.get('ativo')
    const destacado = searchParams.get('destacado')
    const limit = searchParams.get('limit')

    const where: any = {}
    
    if (ativo === 'true') {
      where.ativo = true
    }
    
    if (destacado === 'true') {
      where.destacado = true
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: [
        { destacado: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    // Calcular estatísticas
    const stats = await prisma.review.aggregate({
      where: { ativo: true },
      _avg: { nota: true },
      _count: { id: true }
    })

    const notaPorEstrela = await prisma.review.groupBy({
      by: ['nota'],
      where: { ativo: true },
      _count: { nota: true }
    })

    return NextResponse.json({
      reviews,
      stats: {
        mediaNotas: Number(stats._avg.nota?.toFixed(1)) || 0,
        totalReviews: stats._count.id,
        distribuicaoNotas: notaPorEstrela.reduce((acc, item) => {
          acc[item.nota] = item._count.nota
          return acc
        }, {} as Record<number, number>)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar reviews:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const review = await prisma.review.create({
      data: {
        nome: body.nome,
        avatar: body.avatar,
        nota: body.nota,
        comentario: body.comentario,
        servico: body.servico,
        dataServico: body.dataServico ? new Date(body.dataServico) : null,
        destacado: body.destacado || false,
        source: body.source || 'SITE'
      }
    })

    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar review:', error)
    return NextResponse.json(
      { error: 'Erro ao criar review' }, 
      { status: 500 }
    )
  }
} 