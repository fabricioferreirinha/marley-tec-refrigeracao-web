# 🛡️ Como Evitar Pausas do Supabase (Plano Gratuito)

## ⚠️ Problema Identificado
Projeto Supabase pausado após período de inatividade. **Projetos gratuitos pausam após 7 dias sem atividade.**

## ✅ Estratégias para Manter Ativo (SEM Pro)

### 1. 🤖 Cron Job Automático

Crie um cron job que faça requisições regulares ao seu projeto:

**a) Via Vercel Cron (Gratuito):**

Crie o arquivo: `src/app/api/cron/keep-alive/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Ping simples no banco para manter ativo
    await prisma.$executeRaw`SELECT 1`
    
    // Contar registros (atividade básica)
    const anunciosCount = await prisma.anuncio.count()
    
    console.log(`[Keep-Alive] ${new Date().toISOString()} - ${anunciosCount} anúncios`)
    
    return NextResponse.json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      anunciosCount
    })
  } catch (error) {
    console.error('[Keep-Alive] Erro:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

**b) Configurar no vercel.json:**

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 2. 📱 UptimeRobot (Gratuito)

**Alternativa externa para monitoramento:**

1. **Cadastre-se em [uptimerobot.com](https://uptimerobot.com)** (gratuito)
2. **Adicione seu site:** `https://seu-projeto.vercel.app/api/cron/keep-alive`
3. **Configure para verificar a cada 5 minutos**
4. **Ative notificações por email**

### 3. 🔄 GitHub Actions (Gratuito)

Crie `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Supabase Alive
on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
  workflow_dispatch:  # Permite execução manual

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping application
        run: |
          curl -f https://SEU-PROJETO.vercel.app/api/cron/keep-alive
```

### 4. 📊 Monitoramento de Uso

**Verifique regularmente no dashboard do Supabase:**
- **Database > Usage**
- **Requests per day**
- **Data transfer**

**Mantenha pelo menos 1 request por dia.**

## 🚨 Sistema de Alertas

### Script de Monitoramento Local

Crie `scripts/monitor-supabase.js`:

```javascript
// Monitor de status do Supabase
// Execute: node scripts/monitor-supabase.js

const https = require('https');

async function checkStatus() {
  const url = 'https://SEU-PROJETO.vercel.app/api/cron/keep-alive';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Supabase está ativo:', data);
    } else {
      console.log('❌ Problema detectado:', data);
      // Aqui você pode enviar email, webhook, etc.
    }
  } catch (error) {
    console.log('🚨 ALERTA: Supabase pode estar pausado!');
    console.log('Error:', error.message);
  }
}

checkStatus();
```

### 📧 Alertas por Email (via Resend - gratuito)

Adicione ao keep-alive para notificar quando houver problemas:

```typescript
// Em caso de erro no keep-alive
if (error) {
  // Enviar email de alerta (implementar com Resend/Nodemailer)
  console.error('[ALERTA] Supabase pode estar pausando!');
}
```

## 📅 Cronograma de Manutenção

### **Diário:**
- ✅ UptimeRobot pinga automaticamente
- ✅ Cron job da Vercel executa

### **Semanal:**
- 🔍 Verificar dashboard do Supabase
- 📊 Conferir uso de requests
- 🧪 Testar endpoints manualmente

### **Mensal:**
- 🔄 Verificar se alertas estão funcionando
- 📈 Analisar padrões de uso
- 🛠️ Ajustar frequência se necessário

## 🎯 Limites do Plano Gratuito

**Conhecendo os limites para não ultrapassar:**

- **Database:** 500MB
- **Auth users:** 50,000
- **Storage:** 1GB
- **Bandwidth:** 5GB
- **Requests:** 50,000/mês

## 🔧 Implementação Rápida

**Execute estes comandos:**

1. **Crie o endpoint keep-alive**
2. **Configure UptimeRobot**
3. **Teste o sistema:**

```bash
# Testar localmente
node test-supabase-restore.js

# Testar na produção
curl https://seu-projeto.vercel.app/api/cron/keep-alive
```

## ⚡ Dicas Extras

### **Otimizar Uso:**
- Use cache sempre que possível
- Limite queries desnecessárias
- Implemente paginação

### **Backup de Segurança:**
- Exporte dados importantes regularmente
- Mantenha backup do schema
- Documente configurações

### **Monitoramento:**
- Configure logs estruturados
- Use ferramentas gratuitas de APM
- Monitore performance

---

## 🚀 Próximos Passos

1. ✅ **Restaurar projeto no Supabase**
2. 🤖 **Implementar keep-alive**
3. 📱 **Configurar UptimeRobot**
4. 🔧 **Fazer redeploy na Vercel**
5. ✅ **Testar tudo funcionando**

**Com essas estratégias, seu projeto ficará sempre ativo sem precisar do plano Pro!** 🎉 