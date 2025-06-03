# 🔧 Marley Tec - Sistema Completo de Refrigeração

Sistema web completo para técnico em refrigeração, incluindo site institucional, sistema de classificados e painel administrativo.

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)

## 🚀 Funcionalidades

### 🌐 Site Institucional
- **Landing Page** otimizada para SEO
- **Seção de Serviços** com cards interativos
- **Avaliações de Clientes** estilo Google Reviews
- **Carousel de Marcas** com hover effects
- **Formulário de Contato** integrado
- **Design Responsivo** para todos os dispositivos

### 📱 Sistema de Classificados
- **Criação de Anúncios** com upload de múltiplas imagens
- **Categorias Personalizadas** para equipamentos
- **Sistema de Busca** avançado com filtros
- **Controle de Visibilidade** (carousel e página)
- **Visualizações e Estatísticas**
- **Integração WhatsApp** para contato direto

### ⚙️ Painel Administrativo
- **Dashboard Interativo** com menus funcionais
- **Gerenciamento de Anúncios** (CRUD completo)
- **Sistema de Avaliações** editável
- **Controle de Usuários** e permissões
- **Configurações Globais** do site
- **Toggles de Visibilidade** em tempo real
- **Notificações Toast** para feedback

### 🔐 Sistema de Autenticação
- **Login Supabase** seguro
- **Controle de Acesso** baseado em roles
- **Criação Automática** de usuários
- **Proteção de Rotas** administrativas

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Sonner** - Notificações toast

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - Banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Supabase** - Backend as a Service
- **Upload de Imagens** - Sistema próprio

### DevOps & Ferramentas
- **ESLint** - Linting de código
- **Prettier** - Formatação
- **Git** - Controle de versão

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- PostgreSQL (ou Supabase)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/marley-tec.git
cd marley-tec
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Database
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Upload
UPLOAD_SECRET_KEY="your-secret-key"
```

### 4. Configure o banco de dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma db push

# Seed inicial (opcional)
npx prisma db seed
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🎯 Uso

### Configuração Inicial
1. Acesse `/setup` para configuração inicial
2. Crie o primeiro usuário administrador
3. Configure as avaliações e estatísticas

### Painel Administrativo
- Acesse `/admin` com credenciais de administrador
- **Classificados**: Gerencie anúncios e visibilidade
- **Avaliações**: Edite reviews e estatísticas do Google
- **Usuários**: Controle acesso e permissões

### Publicação de Anúncios
1. Vá para a seção **Classificados** no admin
2. Clique em **"Adicionar Anúncio"**
3. Preencha os dados e faça upload das imagens
4. Configure visibilidade e destaque

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Prisma
npx prisma studio      # Interface visual do banco
npx prisma db push     # Atualizar schema
npx prisma generate    # Gerar cliente
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Painel administrativo
│   ├── classificados/     # Página de classificados
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn)
│   └── admin/            # Componentes admin
├── lib/                  # Utilitários
├── hooks/                # React hooks customizados
└── prisma/               # Schema e migrations
```

## 🔧 Configurações

### Categorias de Equipamentos
- Geladeira
- Freezer
- Máquina de Lavar
- Ar-Condicionado
- Microondas
- Fogão
- E mais...

### Condições do Produto
- Novo
- Seminovo
- Usado
- Para Retirar Peças
- Excelente/Bom/Razoável

### Roles de Usuário
- **USER**: Acesso básico
- **ADMIN**: Acesso completo ao painel

## 🌟 Funcionalidades Avançadas

### SEO Otimizado
- Meta tags dinâmicas
- Schema.org estruturado
- Sitemap automático
- Open Graph tags

### Performance
- Server-side rendering
- Otimização de imagens
- Code splitting automático
- Caching inteligente

### UX/UI
- Design responsivo
- Animações suaves
- Feedback visual (toasts)
- Loading states

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📱 **Mobile** (320px+)
- 📲 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1280px+)

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- **Netlify**: Suporte completo
- **Railway**: Deploy com banco incluído
- **DigitalOcean**: App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Marley Tec** - Técnico em Refrigeração
- 📍 Maricá-RJ
- 📱 WhatsApp: (21) 99749-6201
- 🌐 Site: [marley-tec.com](https://marley-tec.com)

---

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

### 📊 Status do Projeto

✅ **Site Institucional** - Completo  
✅ **Sistema de Classificados** - Completo  
✅ **Painel Admin** - Completo  
✅ **Autenticação** - Completo  
✅ **API REST** - Completo  
✅ **Deploy Ready** - Completo  

**Última atualização:** Dezembro 2024
