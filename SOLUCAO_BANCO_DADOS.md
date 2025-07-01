# 🚨 Solução: Erro "Tenant or user not found"

## Problema Identificado
Seu projeto na Vercel está apresentando erro de conexão com o banco PostgreSQL (Supabase):
```
FATAL: Tenant or user not found
```

## ✅ Soluções (Execute em Ordem)

### 1. 🔍 Diagnóstico Inicial

Acesse o endpoint de diagnóstico criado para verificar a situação:
```
https://SEU-PROJETO.vercel.app/api/debug/database
```

### 2. 🏠 Verificar Supabase

1. **Acesse [supabase.com](https://supabase.com)**
2. **Faça login e vá para seu projeto**
3. **Verifique se o projeto está ATIVO (não pausado)**
4. **Vá para Settings > Database**
5. **Copie as URLs de conexão atualizadas**

### 3. 🔧 Atualizar Variáveis na Vercel

1. **Acesse [vercel.com](https://vercel.com)**
2. **Vá para seu projeto > Settings > Environment Variables**
3. **Adicione/Atualize estas variáveis:**

```env
POSTGRES_PRISMA_URL=postgresql://postgres:[SUA-SENHA]@[SEU-HOST]/postgres?pgbouncer=true&prepared_statements=false&statement_cache_size=0
POSTGRES_URL_NON_POOLING=postgresql://postgres:[SUA-SENHA]@[SEU-HOST]/postgres?prepared_statements=false&statement_cache_size=0
```

**⚠️ IMPORTANTE:** 
- Substitua `[SUA-SENHA]` e `[SEU-HOST]` pelos valores do Supabase
- Adicione os parâmetros `prepared_statements=false&statement_cache_size=0`

### 4. 🚀 Fazer Redeploy

**Opção A - Via Dashboard Vercel:**
1. Vá para o dashboard do seu projeto na Vercel
2. Clique em **"Redeploy"** no último deployment

**Opção B - Via Git (se conectado ao GitHub):**
```bash
git add .
git commit -m "Fix: database connection variables"
git push
```

**Opção C - Via CLI Vercel:**
```bash
vercel --prod
```

### 5. ✅ Testar a Solução

Após o redeploy, teste:

1. **Endpoint de diagnóstico:**
   ```
   https://SEU-PROJETO.vercel.app/api/debug/database
   ```

2. **API de anúncios:**
   ```
   https://SEU-PROJETO.vercel.app/api/anuncios
   ```

3. **Site principal:**
   ```
   https://SEU-PROJETO.vercel.app
   ```

## 🔄 Se o Problema Persistir

### Verificar URLs do Supabase

No dashboard do Supabase:
1. **Settings > Database**
2. **Connection String > URI**
3. **Confirme que as URLs estão corretas**

Formato esperado:
```
postgresql://postgres.XXXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### Regenerar Senha do Banco

Se necessário:
1. **Supabase > Settings > Database**
2. **Reset Database Password**
3. **Atualizar todas as variáveis de ambiente com a nova senha**

## 📞 Teste Local (Opcional)

Se você tem as credenciais localmente:

1. **Criar arquivo `.env` na raiz:**
```env
POSTGRES_PRISMA_URL=postgresql://postgres:[SENHA]@[HOST]/postgres?pgbouncer=true&prepared_statements=false
POSTGRES_URL_NON_POOLING=postgresql://postgres:[SENHA]@[HOST]/postgres?prepared_statements=false
```

2. **Executar teste:**
```bash
node scripts/test-db-connection.js
```

## 🎯 Causas Mais Comuns

1. **❌ Variáveis não configuradas na Vercel**
2. **❌ Projeto Supabase pausado por inatividade**
3. **❌ Senha do banco alterada/expirada**
4. **❌ URLs mal formatadas**
5. **❌ Falta de parâmetros para prepared statements**

## ✅ Checklist Final

- [ ] Projeto Supabase está ativo
- [ ] URLs copiadas corretamente do Supabase
- [ ] Variáveis atualizadas na Vercel
- [ ] Parâmetros `prepared_statements=false` adicionados
- [ ] Redeploy realizado
- [ ] Endpoint de diagnóstico testado
- [ ] Site funcionando normalmente

## 📞 Se Precisar de Ajuda

Execute o script de diagnóstico e compartilhe o resultado:
```bash
node scripts/test-db-connection.js
```

---

**🔧 Arquivos modificados para diagnóstico:**
- `src/app/api/debug/database/route.ts` - Endpoint de diagnóstico
- `scripts/test-db-connection.js` - Script de teste local
- Este arquivo de documentação 