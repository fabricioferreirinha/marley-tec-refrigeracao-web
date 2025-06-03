import { PrismaClient } from '@prisma/client';

// Global para singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

// Configuração específica para Vercel com connection pooling otimizado
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'production' 
        ? process.env.POSTGRES_PRISMA_URL + '?connection_limit=1&pool_timeout=0&connect_timeout=60'
        : process.env.DATABASE_URL
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

// Função para forçar nova conexão limpa
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
    
    // Criar nova instância com URL otimizada para Vercel
    const cleanUrl = process.env.NODE_ENV === 'production' 
      ? process.env.POSTGRES_PRISMA_URL + '?connection_limit=1&pool_timeout=0&connect_timeout=30'
      : process.env.DATABASE_URL
    
    const newClient = new PrismaClient({
      log: ['error'],
      datasources: {
        db: { url: cleanUrl }
      }
    });
    
    // Teste de conexão básico
    await newClient.$queryRaw`SELECT 1 as test`;
    
    // Atualizar instância global
    globalForPrisma.prisma = newClient;
    
    console.log('✅ Nova conexão Prisma criada');
    return newClient;
  } catch (error) {
    console.error('❌ Falha ao criar nova conexão:', error);
    throw error;
  }
}

// Função withRetry específica para erros de prepared statement
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
      
      // Detectar especificamente erros de prepared statement
      const isPreparedStatementError = error instanceof Error && 
        (error.message.includes('prepared statement') || 
         error.message.includes('42P05') || 
         error.message.includes('26000') ||
         error.message.includes('already exists') ||
         error.message.includes('does not exist'));
      
      if (isPreparedStatementError) {
        console.log('🔄 Forçando nova conexão devido a erro de prepared statement/conexão');
        try {
          await forceNewConnection();
        } catch (resetError) {
          console.error('Erro ao resetar conexão:', resetError);
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

// Executar com cliente completamente isolado
export async function executeWithFreshClient<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const freshClient = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.POSTGRES_PRISMA_URL + '?connection_limit=1&pool_timeout=0'
          : process.env.DATABASE_URL
      }
    }
  });
  
  try {
    return await operation(freshClient);
  } finally {
    await freshClient.$disconnect();
  }
}

export default prisma; 