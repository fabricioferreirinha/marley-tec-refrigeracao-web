import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

// GET - Buscar role do usuário
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`🔍 Buscando role para usuário: ${id}`)

    // Buscar o usuário na tabela User
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      })
    })

    console.log(`👤 Usuário encontrado:`, user ? `${user.email} (${user.id}) - Role: ${user.role}` : 'não encontrado')

    if (!user) {
      // Se não existe, retornar role USER como padrão
      console.log(`❌ Usuário não encontrado, retornando role USER`)
      return NextResponse.json({ role: 'USER' })
    }

    const role = user.role || 'USER'
    console.log(`🏁 Role final retornado: ${role}`)
    return NextResponse.json({ role })
  } catch (error) {
    console.error('❌ Erro ao buscar role do usuário:', error)
    return NextResponse.json({ role: 'USER' }) // Fallback seguro
  }
}

// PUT - Atualizar role do usuário
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { role } = body

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Role inválido. Use USER ou ADMIN.' },
        { status: 400 }
      )
    }

    // Atualizar o role diretamente na tabela User
    const updatedUser = await withRetry(async () => {
      return await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      })
    })

    return NextResponse.json({ 
      message: 'Role atualizado com sucesso',
      role: updatedUser.role
    })
  } catch (error) {
    console.error('Erro ao atualizar role do usuário:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 