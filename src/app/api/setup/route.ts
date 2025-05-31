import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe usuário admin
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@marleytec.com' }
    })

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Usuário admin já existe',
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name
        }
      })
    }

    // Criar usuário admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@marleytec.com',
        name: 'Administrador Marley Tec',
        password: hashedPassword
      }
    })

    // Criar alguns anúncios de exemplo
    const sampleAds = [
      {
        titulo: 'Geladeira Brastemp Duplex 400L',
        descricao: 'Geladeira em ótimo estado, pouco uso. Frost free, duplex, cor branca. Funcionando perfeitamente.',
        preco: 800.00,
        imagens: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'],
        contato: '(21) 99999-9999'
      },
      {
        titulo: 'Máquina de Lavar 12kg Electrolux',
        descricao: 'Máquina de lavar semi-nova, 12kg, com várias funções. Ideal para famílias grandes.',
        preco: 650.00,
        imagens: ['https://images.unsplash.com/photo-1558618666-fcd8c9cd6c60?w=400'],
        contato: '(21) 98888-8888'
      },
      {
        titulo: 'Ar Condicionado Split 12.000 BTUs',
        descricao: 'Ar condicionado Split Midea 12.000 BTUs, usado mas funcionando bem. Controle incluso.',
        preco: 450.00,
        imagens: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
        contato: '(21) 97777-7777'
      },
      {
        titulo: 'Micro-ondas LG 30L',
        descricao: 'Micro-ondas LG 30 litros, diversas funções, display digital. Funcionando perfeitamente.',
        preco: 280.00,
        imagens: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8052?w=400'],
        contato: '(21) 96666-6666'
      },
      {
        titulo: 'Fogão 4 Bocas Consul',
        descricao: 'Fogão 4 bocas da Consul, forno grande, cor branca. Usado mas em bom estado.',
        preco: 320.00,
        imagens: ['https://images.unsplash.com/photo-1556909114-67c9ec7cea3c?w=400'],
        contato: '(21) 95555-5555'
      },
      {
        titulo: 'Lava-Louças Brastemp 8 Serviços',
        descricao: 'Lava-louças compacta para 8 serviços, economia de água e energia. Pouco usada.',
        preco: 520.00,
        imagens: ['https://images.unsplash.com/photo-1556908114-4b564bc90b4d?w=400'],
        contato: '(21) 94444-4444'
      }
    ]

    for (const ad of sampleAds) {
      await prisma.anuncio.create({
        data: ad
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      },
      adsCreated: sampleAds.length
    })

  } catch (error) {
    console.error('Erro ao inicializar banco:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 