import { PrismaClient } from '@prisma/client';

// Global para singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

// URL com prepared statements desabilitados para Vercel
const getPrismaUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Usar directUrl (não-pooled) para evitar conflitos de prepared statements
    const baseUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
    return baseUrl + '?prepared_statements=false&statement_cache_size=0&connect_timeout=60&pool_timeout=0'
  }
  return process.env.DATABASE_URL + '?prepared_statements=false'
}

// Configuração específica para Vercel com prepared statements desabilitados
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getPrismaUrl()
    }
  }
});

// Singleton - evitar múltiplas instâncias em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Cleanup automático
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

// Função para forçar nova conexão com URL completamente limpa
export async function forceNewConnection(): Promise<PrismaClient> {
  try {
    console.log('🚨 Forçando nova conexão Prisma...');
    
    // Desconectar instância atual
    if (globalForPrisma.prisma) {
      try {
        await globalForPrisma.prisma.$disconnect();
      } catch (e) {
        console.log('Ignorando erro ao desconectar:', e);
      }
    }
    
    // Criar URL com timestamp para garantir nova conexão
    const timestamp = Date.now()
    let cleanUrl = getPrismaUrl()
    cleanUrl += `&cache_bust=${timestamp}&application_name=marley_tec_${timestamp}`
    
    const newClient = new PrismaClient({
      log: ['error'],
      datasources: {
        db: { url: cleanUrl }
      }
    });
    
    // Teste de conexão sem prepared statement
    await newClient.$executeRaw`SELECT 1 as test`;
    
    // Atualizar instância global
    globalForPrisma.prisma = newClient;
    
    console.log('✅ Nova conexão Prisma criada');
    return newClient;
  } catch (error) {
    console.error('❌ Falha ao criar nova conexão:', error);
    throw error;
  }
}

// Função para limpar prepared statements do PostgreSQL
export async function clearPostgreSQLCache(): Promise<boolean> {
  try {
    console.log('🧹 Limpando cache PostgreSQL...')
    
    const cleanClient = new PrismaClient({
      log: ['error'],
      datasources: {
        db: { 
          url: (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL) + 
               '?prepared_statements=false&statement_cache_size=0'
        }
      }
    })
    
    // Comandos para limpar prepared statements
    await cleanClient.$executeRaw`DEALLOCATE ALL`
    
    await cleanClient.$disconnect()
    console.log('✅ Cache PostgreSQL limpo')
    return true
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error)
    return false
  }
}

// Função withRetry mais agressiva
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) break;
      
      // Detectar erros de prepared statement
      const isPreparedStatementError = error instanceof Error && 
        (error.message.includes('prepared statement') || 
         error.message.includes('42P05') || 
         error.message.includes('26000') ||
         error.message.includes('already exists') ||
         error.message.includes('does not exist'));
      
      if (isPreparedStatementError) {
        console.log('🔄 Forçando nova conexão devido a erro de prepared statement/conexão')
        try {
          // Primeiro tentar limpar cache do PostgreSQL
          await clearPostgreSQLCache()
          
          // Depois forçar nova conexão
          await forceNewConnection()
          
          // Pausa extra após reset para estabilizar
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (resetError) {
          console.error('Erro ao resetar conexão:', resetError)
        }
      }
      
      // Delay exponencial entre tentativas
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Executar com cliente completamente isolado e URL única
export async function executeWithFreshClient<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const timestamp = Date.now()
  let freshUrl = getPrismaUrl()
  freshUrl += `&cache_bust=${timestamp}&application_name=fresh_${timestamp}`
  
  const freshClient = new PrismaClient({
    log: ['error'],
    datasources: {
      db: { url: freshUrl }
    }
  });
  
  try {
    return await operation(freshClient);
  } finally {
    await freshClient.$disconnect();
  }
}

export default prisma; 