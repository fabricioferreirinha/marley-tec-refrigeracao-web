# 📋 Configuração do Projeto Marley-Tec

## ✅ Problemas Resolvidos

### 🚫 Erro: "PrismaClient deve ser usado apenas no servidor"
**Status: RESOLVIDO ✅**

**Causa**: O Prisma estava sendo importado em componentes client-side através do arquivo `utils.ts`

**Solução Implementada**:
1. Removido import do Prisma do arquivo `src/lib/utils.ts`
2. Criado arquivo `src/lib/server-utils.ts` com funções server-only
3. Corrigida configuração do Prisma para usar `POSTGRES_PRISMA_URL`
4. Instalado pacote `server-only` para garantir isolamento

## 🔧 Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database URLs (Supabase)
POSTGRES_PRISMA_URL="postgresql://[user]:[password]@[host]/[database]?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://[user]:[password]@[host]/[database]"

# Next.js
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Upload/Storage (se usando Supabase Storage)
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key-aqui"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"

# Desenvolvimento
NODE_ENV="development"
```

## 📁 Estrutura de Arquivos Atualizada

```
src/
├── lib/
│   ├── prisma.ts          # ✅ Configuração do Prisma (server-only)
│   ├── server-utils.ts    # ✅ Funções server-only
│   └── utils.ts           # ✅ Funções client-safe
├── components/
│   ├── ImageUpload.tsx    # ✅ Novo componente com progresso
│   ├── AdminClassifieds.tsx # ✅ Com tempo relativo
│   └── AdminReviews.tsx   # ✅ Com upload e edição de stats
```

## 🎯 Funcionalidades Implementadas

### 1. Sistema de Upload Melhorado
- ✅ Progresso visual durante upload
- ✅ Validação de tipos e tamanhos
- ✅ Redimensionamento automático
- ✅ Feedback de sucesso/erro

### 2. Tempo Relativo
- ✅ Função `timeAgo()` em português
- ✅ Exemplos: "5 dias atrás", "1 ano atrás"
- ✅ Aplicado em classificados e reviews

### 3. Gerenciador de Reviews
- ✅ Upload de imagem em vez de URL
- ✅ Edição de estatísticas (média e quantidade)
- ✅ Avatar personalizado com cores
- ✅ Tempo relativo nos reviews

### 4. Visualização de Imagens
- ✅ Aspect ratio correto (não cortadas)
- ✅ Hover effects e transições
- ✅ Preview responsivo

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   - Copie o exemplo acima para um arquivo `.env`
   - Configure suas credenciais do Supabase

3. **Executar o projeto**:
   ```bash
   npm run dev
   ```

4. **Acessar**:
   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção local
npm start

# Regenerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma db push
```

## 📝 Notas Importantes

1. **Prisma**: Agora funciona corretamente apenas no servidor
2. **Upload**: Sistema implementado com feedback visual
3. **Imagens**: Não mais cortadas, aspect ratio preservado
4. **Reviews**: Sistema completo de gerenciamento
5. **Performance**: Pool de conexões otimizado para desenvolvimento

## 🎉 Status Final

**✅ TUDO FUNCIONANDO CORRETAMENTE**

- ✅ Servidor rodando sem erros
- ✅ Prisma funcionando apenas no servidor
- ✅ Upload com progresso implementado
- ✅ Tempo relativo funcionando
- ✅ Imagens com visualização correta
- ✅ Reviews com upload e edição de stats 