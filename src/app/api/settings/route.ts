import { NextRequest, NextResponse } from 'next/server'

// Configurações padrão do site
const defaultSettings = {
  settings: {
    stats: {
      yearsExperience: 15,
      clientsServed: 1500,
      equipmentsSaved: 4000
    },
    business: {
      name: 'Marley Tec - Assistência Técnica',
      email: 'contato@marleytec.com',
      phone: '(21) 99749-6201',
      whatsapp: '5521997496201',
      address: 'Maricá - RJ'
    },
    colors: {
      primary: '#1e40af',
      secondary: '#f97316',
      accent: '#10b981'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Em uma aplicação real, essas configurações viriam do banco de dados
    // Por enquanto, retornamos as configurações padrão
    
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Aqui você poderia salvar as configurações no banco de dados
    // Por enquanto, apenas retornamos sucesso
    
    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      settings: body
    })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 