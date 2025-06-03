import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    console.log('🌱 Populando banco de dados...')

    // Criar anúncios de exemplo
    console.log('Criando anúncios...')
    
    const anuncios = [
      {
        titulo: 'Geladeira Brastemp Frost Free 375L',
        descricao: 'Geladeira Brastemp Frost Free 375L em excelente estado de conservação. Funcionando perfeitamente, sem vazamentos. Ideal para família de 4 pessoas. Aceito cartão.',
        preco: 1200.00,
        categoria: 'GELADEIRA' as const,
        condicao: 'SEMINOVO' as const,
        localizacao: 'Centro - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'],
        destaque: true,
        status: 'ATIVO' as const,
        whatsappMessage: 'Olá! Tenho interesse na geladeira Brastemp 375L.',
        referencia: 'REF2024001'
      },
      {
        titulo: 'Máquina de Lavar Electrolux 12kg',
        descricao: 'Máquina de lavar Electrolux 12kg, seminova, pouco uso. Todas as funções funcionando perfeitamente. Entrego na região.',
        preco: 800.00,
        categoria: 'MAQUINA_LAVAR' as const,
        condicao: 'SEMINOVO' as const,
        localizacao: 'Itaipuaçu - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400'],
        destaque: true,
        status: 'ATIVO' as const,
        whatsappMessage: 'Oi! Gostaria de saber mais sobre a máquina de lavar.',
        referencia: 'REF2024002'
      },
      {
        titulo: 'Freezer Horizontal Consul 280L',
        descricao: 'Freezer horizontal Consul 280L em bom estado. Temperatura constante, sem defeitos. Ideal para comércios ou residências.',
        preco: 650.00,
        categoria: 'FREEZER' as const,
        condicao: 'USADO' as const,
        localizacao: 'Bambuí - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400'],
        destaque: false,
        status: 'ATIVO' as const,
        whatsappMessage: 'Olá! Tenho interesse no freezer Consul.',
        referencia: 'REF2024003'
      },
      {
        titulo: 'Micro-ondas Panasonic 21L',
        descricao: 'Micro-ondas Panasonic 21L em excelente estado. Pouco uso, todas as funções funcionando. Com manual e nota fiscal.',
        preco: 180.00,
        categoria: 'MICROONDAS' as const,
        condicao: 'SEMINOVO' as const,
        localizacao: 'São José - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'],
        destaque: true,
        status: 'ATIVO' as const,
        whatsappMessage: 'Oi! Quero saber mais sobre o micro-ondas.',
        referencia: 'REF2024004'
      },
      {
        titulo: 'Ar-Condicionado Split 9000 BTUs',
        descricao: 'Ar-condicionado split Springer 9000 BTUs, pouco uso. Economiza energia e gela muito bem. Com controle remoto.',
        preco: 450.00,
        categoria: 'AR_CONDICIONADO' as const,
        condicao: 'BOM' as const,
        localizacao: 'Centro - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400'],
        destaque: false,
        status: 'ATIVO' as const,
        whatsappMessage: 'Oi! Tenho interesse no ar-condicionado split.',
        referencia: 'REF2024005'
      },
      {
        titulo: 'Fogão 4 Bocas Atlas',
        descricao: 'Fogão Atlas 4 bocas em bom estado. Todas as bocas funcionando, forno testado. Ideal para uso residencial.',
        preco: 320.00,
        categoria: 'FOGAO' as const,
        condicao: 'USADO' as const,
        localizacao: 'Itaipuaçu - Maricá',
        contato: '21997496201',
        imagens: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
        destaque: false,
        status: 'ATIVO' as const,
        whatsappMessage: 'Olá! Gostaria de saber mais sobre o fogão.',
        referencia: 'REF2024006'
      }
    ]

    for (const anuncio of anuncios) {
      const existing = await prisma.anuncio.findUnique({
        where: { referencia: anuncio.referencia }
      })
      
      if (!existing) {
        await prisma.anuncio.create({ data: anuncio })
        console.log(`✅ Anúncio criado: ${anuncio.titulo}`)
      } else {
        console.log(`⚠️ Anúncio já existe: ${anuncio.titulo}`)
      }
    }

    console.log('✅ Anúncios processados')

    // Criar reviews de exemplo
    console.log('Criando reviews...')
    
    const reviews = [
      {
        nome: 'Maria Silva',
        avatarColor: '#10B981',
        avatarInitials: 'MS',
        nota: 5.0,
        comentario: 'Excelente serviço! O técnico foi muito profissional e resolveu o problema da minha geladeira rapidamente. Recomendo!',
        source: 'GOOGLE',
        tempoRelativo: '2 semanas atrás',
        ativo: true
      },
      {
        nome: 'João Santos',
        avatarColor: '#3B82F6',
        avatarInitials: 'JS',
        nota: 4.8,
        comentario: 'Atendimento 24h realmente funciona. Chamei de madrugada e o técnico veio resolver meu ar-condicionado. Muito satisfeito!',
        source: 'FACEBOOK',
        tempoRelativo: '1 semana atrás',
        ativo: true
      },
      {
        nome: 'Ana Costa',
        avatarColor: '#EC4899',
        avatarInitials: 'AC',
        nota: 5.0,
        comentario: 'Trabalho impecável! Consertou minha máquina de lavar que estava com problema há meses. Preço justo e garantia.',
        source: 'WHATSAPP',
        tempoRelativo: '3 dias atrás',
        ativo: true
      },
      {
        nome: 'Carlos Oliveira',
        avatarColor: '#F97316',
        avatarInitials: 'CO',
        nota: 4.5,
        comentario: 'Muito pontual e eficiente. Resolveu o problema do meu freezer em menos de uma hora. Recomendo o serviço.',
        source: 'SITE',
        tempoRelativo: '1 semana atrás',
        ativo: true
      },
      {
        nome: 'Lucia Ferreira',
        avatarColor: '#8B5CF6',
        avatarInitials: 'LF',
        nota: 5.0,
        comentario: 'Melhor técnico da região! Já chamei várias vezes e sempre resolve tudo perfeitamente. Pessoa de confiança.',
        source: 'GOOGLE',
        tempoRelativo: '4 dias atrás',
        ativo: true
      },
      {
        nome: 'Roberto Lima',
        avatarColor: '#06B6D4',
        avatarInitials: 'RL',
        nota: 4.9,
        comentario: 'Serviço de qualidade! Técnico experiente que explica tudo direitinho. Instalou meu ar-condicionado perfeitamente.',
        source: 'FACEBOOK',
        tempoRelativo: '5 dias atrás',
        ativo: true
      },
      {
        nome: 'Patricia Mendes',
        avatarColor: '#EF4444',
        avatarInitials: 'PM',
        nota: 5.0,
        comentario: 'Super recomendo! Consertou meu microondas que não esquentava mais. Ficou como novo, preço honesto.',
        source: 'GOOGLE',
        tempoRelativo: '2 semanas atrás',
        ativo: true
      },
      {
        nome: 'Fernando Rocha',
        avatarColor: '#059669',
        avatarInitials: 'FR',
        nota: 4.7,
        comentario: 'Técnico muito competente! Resolveu o problema da minha lava-louças rapidamente. Pontual e educado.',
        source: 'SITE',
        tempoRelativo: '6 dias atrás',
        ativo: true
      }
    ]

    for (const review of reviews) {
      const existing = await prisma.review.findFirst({
        where: { 
          nome: review.nome,
          comentario: review.comentario
        }
      })
      
      if (!existing) {
        await prisma.review.create({ data: review })
        console.log(`✅ Review criado: ${review.nome}`)
      } else {
        console.log(`⚠️ Review já existe: ${review.nome}`)
      }
    }

    console.log('✅ Reviews processados')

    // Criar configurações para estatísticas editáveis
    console.log('Criando configurações...')
    
    const configuracoes = [
      {
        chave: 'reviews_media_notas',
        valor: '4.8',
        descricao: 'Média das notas de avaliação (editável)'
      },
      {
        chave: 'reviews_quantidade_total',
        valor: '127',
        descricao: 'Quantidade total de avaliações (editável)'
      }
    ]

    for (const config of configuracoes) {
      const existing = await prisma.configuracao.findUnique({
        where: { chave: config.chave }
      })
      
      if (!existing) {
        await prisma.configuracao.create({ data: config })
        console.log(`✅ Configuração criada: ${config.chave}`)
      } else {
        console.log(`⚠️ Configuração já existe: ${config.chave}`)
      }
    }

    console.log('✅ Configurações processadas')
    console.log('🎉 Seed concluído! Banco de dados populado com dados de exemplo.')

    // Resumo dos dados criados
    const totalAnuncios = await prisma.anuncio.count()
    const totalReviews = await prisma.review.count()
    const totalConfigs = await prisma.configuracao.count()
    const totalUsers = await prisma.user.count()

    console.log(`📊 Resumo do banco de dados:`)
    console.log(`   - Usuários: ${totalUsers}`)
    console.log(`   - Anúncios: ${totalAnuncios}`)
    console.log(`   - Reviews: ${totalReviews}`)
    console.log(`   - Configurações: ${totalConfigs}`)

  } catch (error) {
    console.error('❌ Erro no seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}) 