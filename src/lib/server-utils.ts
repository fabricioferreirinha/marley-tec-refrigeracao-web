import 'server-only'
import { prisma } from './prisma'

export async function generateFriendlyReference(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const yearStr = currentYear.toString()
  
  // Buscar o último anúncio do ano atual para gerar o próximo número
  const lastAd = await prisma.anuncio.findFirst({
    where: {
      referencia: {
        startsWith: `REF${yearStr}`
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  let nextNumber = 1
  
  if (lastAd && lastAd.referencia) {
    // Extrair o número da referência (REF2024001 -> 001)
    const match = lastAd.referencia.match(/REF\d{4}(\d{3})/)
    if (match) {
      nextNumber = parseInt(match[1]) + 1
    }
  }
  
  // Formatar com 3 dígitos (001, 002, etc.)
  const formattedNumber = nextNumber.toString().padStart(3, '0')
  
  return `REF${yearStr}${formattedNumber}`
} 