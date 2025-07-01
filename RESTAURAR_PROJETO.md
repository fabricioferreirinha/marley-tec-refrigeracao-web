# 🚀 Guia Rápido: Restaurar Projeto e Evitar Pausas

## 📋 Situação Atual
✅ **Problema identificado:** Projeto Supabase pausado por inatividade
✅ **Solução implementada:** Sistema keep-alive automático
✅ **Arquivos criados:**
- `src/app/api/cron/keep-alive/route.ts` - Endpoint que mantém o banco ativo
- `vercel.json` - Atualizado com cron job automático
- Documentação completa em `EVITAR_PAUSA_SUPABASE.md`

---

## 🎯 Passos Para Resolver (Execute AGORA)

### **1. 🏠 Restaurar Supabase (PRIORITÁRIO)**
1. Acesse [supabase.com](https://supabase.com)
2. Faça login e vá para o projeto "supabase-marley-tec"
3. **Clique em "Restore project"** ou "Reativar projeto"
4. Aguarde 2-3 minutos para o projeto ativar

### **2. 🚀 Fazer Deploy das Correções**
Execute um dos comandos:

```bash
# Opção A: Via Git (se conectado ao GitHub)
git add .
git commit -m "feat: adicionar keep-alive para evitar pausa do Supabase"
git push

# Opção B: Via Vercel CLI
vercel --prod

# Opção C: Via dashboard da Vercel
# Vá para vercel.com > seu projeto > clique em "Redeploy"
```

### **3. ✅ Testar Se Funcionou**
Após o deploy, teste:

**a) Keep-alive endpoint:**
```
https://seu-projeto.vercel.app/api/cron/keep-alive
```
Deve retornar: `"status": "alive"`

**b) API principal:**
```
https://seu-projeto.vercel.app/api/anuncios
```

**c) Site principal:**
```
https://seu-projeto.vercel.app
```

---

## 🤖 Como Funciona o Sistema de Proteção

### **Cron Job Automático (Vercel):**
- ⏰ **Executa a cada 6 horas automaticamente**
- 🔄 **Faz queries simples no banco para manter ativo**
- 📊 **Monitora saúde das tabelas**
- 🕐 **Horários:** 00:00, 06:00, 12:00, 18:00 (UTC)

### **Monitoramento:**
- ✅ Logs no Vercel mostram execuções
- 📈 Contador de execuções salvo no próprio banco
- 🚨 Retorna erro 500 se houver problemas

---

## 📱 Configurar Monitoramento Externo (Opcional)

Para segurança extra, configure o UptimeRobot:

1. **Cadastre-se em [uptimerobot.com](https://uptimerobot.com)** (gratuito)
2. **Adicione monitor:**
   - URL: `https://seu-projeto.vercel.app/api/cron/keep-alive`
   - Tipo: HTTP(s)
   - Intervalo: 5 minutos
3. **Configure alertas por email**

---

## 🔍 Diagnóstico de Problemas

### **Se o keep-alive falhar:**
```bash
# Verificar logs no Vercel:
# Dashboard > seu projeto > Functions > Ver logs

# Testar manualmente:
curl https://seu-projeto.vercel.app/api/cron/keep-alive
```

### **Se o Supabase pausar novamente:**
1. **Verifique se o cron está rodando** (logs da Vercel)
2. **Confirme se as requests estão chegando** (dashboard Supabase)
3. **Execute o keep-alive manualmente** para testar

---

## 📊 Limites para Ficar Atento

**Plano Gratuito Supabase:**
- **Database:** 500MB
- **Requests:** 50,000/mês  
- **Bandwidth:** 5GB/mês

**Com keep-alive (a cada 6h):**
- **Requests mensais:** ~120 (bem abaixo do limite)
- **Impacto no bandwidth:** Mínimo

---

## ✅ Checklist Final

- [ ] Projeto Supabase restaurado
- [ ] Deploy feito com arquivos atualizados
- [ ] Keep-alive funcionando (teste manual)
- [ ] Cron job configurado no Vercel
- [ ] UptimeRobot configurado (opcional)
- [ ] Site voltou a funcionar normalmente

---

## 🎉 Resultado Esperado

**Depois de implementar:**
- ✅ Seu projeto **NUNCA MAIS** será pausado automaticamente
- ✅ Supabase receberá pings regulares mantendo-o ativo
- ✅ Sistema roda **100% automaticamente**
- ✅ **Zero custo adicional** (usa recursos gratuitos)

**🎯 Próxima verificação:** Confira em 1 semana se tudo está funcionando! 