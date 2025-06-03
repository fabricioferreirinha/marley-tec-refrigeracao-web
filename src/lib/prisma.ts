import { PrismaClient, Prisma } from '@prisma/client';

// Verificar se estamos no servidor
const isServer = typeof window === 'undefined';

if (!isServer) {
  throw new Error('PrismaClient deve ser usado apenas no servidor');
}

// Configurações específicas para Supabase
const isDevelopment = process.env.NODE_ENV === 'development';

// Configurações específicas do Prisma para Supabase
const prismaConfig: Prisma.PrismaClientOptions = {
  log: isDevelopment ? ['warn', 'error'] : ['error'],
  errorFormat: 'pretty' as const,
};

// Em desenvolvimento, desabilitar prepared statements para evitar conflitos
if (isDevelopment) {
  const connectionString = new URL(process.env.POSTGRES_PRISMA_URL!);
  connectionString.searchParams.set('prepared_statements', 'false');
  connectionString.searchParams.set('pgbouncer', 'true');
  
  prismaConfig.datasources = {
    db: {
      url: connectionString.toString(),
    },
  };
}

// Declare global var to store Prisma instance
declare global {
  var __prisma: PrismaClient | undefined;
  var __connectionCount: number | undefined;
}

// Função para criar nova instância com configurações otimizadas
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient(prismaConfig);
  
  // Incrementar contador de conexões
  if (isDevelopment) {
    global.__connectionCount = (global.__connectionCount || 0) + 1;
    console.log(`🔌 Criando nova instância Prisma (#${global.__connectionCount})`);
  }
  
  // Interceptar queries para adicionar logging em desenvolvimento
  if (isDevelopment) {
    client.$use(async (params, next) => {
      const before = Date.now();
      try {
        const result = await next(params);
        const after = Date.now();
        console.log(`✅ Query ${params.model}.${params.action} took ${after - before}ms`);
        return result;
      } catch (error) {
        console.error(`❌ Query ${params.model}.${params.action} failed:`, error);
        throw error;
      }
    });
  }

  return client;
}

// Sistema singleton simples e robusto
function getPrismaClient(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
    
    // Cleanup quando o processo terminar
    process.on('beforeExit', async () => {
      if (global.__prisma) {
        await global.__prisma.$disconnect();
        global.__prisma = undefined;
        console.log('🔌 Prisma client disconnected on exit');
      }
    });
  }

  return global.__prisma;
}

// Instância principal exportada
export const prisma = getPrismaClient();

// Função para forçar nova conexão (reset mais agressivo)
export async function forceNewConnection(): Promise<PrismaClient> {
  try {
    console.log('🚨 Forçando nova conexão Prisma...');
    
    // Desconectar instância atual
    if (global.__prisma) {
      try {
        await global.__prisma.$disconnect();
      } catch (e) {
        console.log('Ignorando erro ao desconectar:', e);
      }
      global.__prisma = undefined;
    }
    
    // Criar nova instância
    const newClient = createPrismaClient();
    
    // Teste de conexão simples
    await newClient.$queryRaw`SELECT 1 as test`;
    
    // Armazenar como instância global
    global.__prisma = newClient;
    
    console.log('✅ Nova conexão Prisma criada com sucesso');
    return newClient;
  } catch (error) {
    console.error('❌ Falha ao criar nova conexão:', error);
    throw error;
  }
}

// Função para resetar conexão em caso de erro grave
export async function resetPrismaConnection(): Promise<boolean> {
  try {
    await forceNewConnection();
    return true;
  } catch (error) {
    console.error('❌ Failed to reset Prisma connection:', error);
    return false;
  }
}

// Função para verificar saúde da conexão
export async function checkPrismaHealth(): Promise<boolean> {
  try {
    // Query simples para testar conexão
    await prisma.$queryRaw`SELECT 1 as health`;
    return true;
  } catch (error) {
    console.error('❌ Prisma health check failed:', error);
    
    // Tentar reset automático
    const resetSuccess = await resetPrismaConnection();
    if (resetSuccess) {
      console.log('✅ Auto-recovery successful');
      return true;
    }
    
    return false;
  }
}

// Função helper mais robusta para executar queries com retry e nova conexão
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
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Se for erro de prepared statement ou conexão, forçar nova conexão
      const isConnectionError = error instanceof Error && 
        (error.message.includes('prepared statement') || 
         error.message.includes('42P05') || 
         error.message.includes('26000') || 
         error.message.includes('does not exist') ||
         error.message.includes('connection') ||
         error.message.includes('ConnectorError'));
      
      if (isConnectionError || attempt === 1) {
        console.log('🔄 Forçando nova conexão devido a erro de prepared statement/conexão');
        try {
          await forceNewConnection();
          // Pausa para estabilizar
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (resetError) {
          console.error('Erro ao resetar conexão:', resetError);
          // Continuar com pausa normal
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } else {
        // Para outros erros, pausa progressiva
        const delay = Math.pow(2, attempt) * 500;
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

// Função para executar operação com cliente fresco (para casos extremos)
export async function executeWithFreshClient<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const freshClient = await forceNewConnection();
  try {
    return await operation(freshClient);
  } catch (error) {
    console.error('Erro mesmo com cliente fresh:', error);
    throw error;
  }
}

export default prisma; 