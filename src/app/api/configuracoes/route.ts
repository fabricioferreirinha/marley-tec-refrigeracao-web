import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, executeWithFreshClient } from '@/lib/prisma'

// Marcar como dinâmica para evitar erro de renderização estática
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('🔍 [Config API] Buscando configurações...')
    
    const result = await withRetry(async () => {
      const configuracoes = await prisma.configuracao.findMany({
        orderBy: {
          chave: 'asc'
        }
      })

      // Converter array para objeto para facilitar uso
      const configObj = configuracoes.reduce((acc, config) => {
        acc[config.chave] = config.valor
        return acc
      }, {} as Record<string, string>)

      return { configuracoes: configObj }
    })

    console.log('✅ [Config API] Configurações encontradas:', Object.keys(result.configuracoes))
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ [Config API] Erro ao buscar configurações:', error)
    
    // Fallback com cliente fresh
    try {
      console.log('🚨 [Config API] Tentando com cliente fresh...')
      
      const result = await executeWithFreshClient(async (freshClient) => {
        const configuracoes = await freshClient.configuracao.findMany({
          orderBy: {
            chave: 'asc'
          }
        })

        const configObj = configuracoes.reduce((acc, config) => {
          acc[config.chave] = config.valor
          return acc
        }, {} as Record<string, string>)

        return { configuracoes: configObj }
      })
      
      console.log('✅ [Config API] Sucesso com cliente fresh')
      return NextResponse.json(result)
    } catch (freshError) {
      console.error('❌ [Config API] Erro mesmo com cliente fresh:', freshError)
      
      // Fallback com configurações vazias
      console.log('🔄 [Config API] Usando fallback vazio')
      return NextResponse.json({ configuracoes: {} })
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [Config API] Atualizando configurações...')
    
    const body = await request.json()
    const { configuracoes } = body

    if (!configuracoes || typeof configuracoes !== 'object') {
      return NextResponse.json(
        { error: 'Configurações inválidas' },
        { status: 400 }
      )
    }

    const result = await withRetry(async () => {
      const promises = Object.entries(configuracoes).map(([chave, valor]) =>
        prisma.configuracao.upsert({
          where: { chave },
          create: { 
            chave, 
            valor: String(valor),
            descricao: getDescricaoConfig(chave)
          },
          update: { 
            valor: String(valor),
            updatedAt: new Date()
          }
        })
      )
      
      return await Promise.all(promises)
    })

    console.log('✅ [Config API] Configurações atualizadas com sucesso')
    return NextResponse.json({ 
      message: 'Configurações atualizadas com sucesso',
      configuracoes: result
    })
  } catch (error) {
    console.error('❌ [Config API] Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getDescricaoConfig(chave: string): string {
  const descricoes: Record<string, string> = {
    'telefone': 'Número de telefone/WhatsApp principal',
    'horario_funcionamento': 'Horário de funcionamento padrão',
    'horario_emergencia': 'Disponibilidade para emergências',
    'cnpj': 'CNPJ da empresa',
    'endereco': 'Endereço da empresa',
    'email': 'Email de contato',
    'google_review_url': 'URL para deixar avaliação no Google',
    'site_ativo': 'Site está ativo (true/false)',
    'emergencia_24h': 'Atendimento 24h ativo (true/false)'
  }
  
  return descricoes[chave] || `Configuração: ${chave}`
} 