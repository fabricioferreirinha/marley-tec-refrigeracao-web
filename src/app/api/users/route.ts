import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

// GET - Listar todos os usuários
export async function GET(request: NextRequest) {
  try {
    const users = await withRetry(async () => {
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name } = body

    console.log(`🔄 Tentando criar usuário:`, { id, email, name })

    if (!id || !email) {
      console.log(`❌ Dados incompletos para criação de usuário`)
      return NextResponse.json(
        { error: 'ID e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existingUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id }
      })
    })

    if (existingUser) {
      console.log(`⚠️ Usuário já existe:`, existingUser.email)
      return NextResponse.json(
        { user: existingUser },
        { status: 200 }
      )
    }

    // Verificar se é o primeiro usuário (para definir como ADMIN)
    const userCount = await withRetry(async () => {
      return await prisma.user.count()
    })

    console.log(`📊 Total de usuários antes da criação: ${userCount}`)

    let role: 'USER' | 'ADMIN' = 'USER'
    if (userCount === 0) {
      // Primeiro usuário vira admin automaticamente
      console.log(`🎯 Primeiro usuário detectado, definindo como ADMIN`)
      role = 'ADMIN'
    } else {
      console.log(`👥 Não é o primeiro usuário (total: ${userCount}), role USER mantido`)
    }

    // Criar o usuário
    console.log(`✏️ Criando usuário no banco de dados com role: ${role}`)
    const user = await withRetry(async () => {
      return await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    })

    console.log(`✅ Usuário criado:`, user)
    console.log(`🏁 Usuário criado com sucesso:`, { email, role: user.role })
    return NextResponse.json({ 
      user
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 