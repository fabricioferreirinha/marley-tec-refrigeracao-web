# Marley-Tec

Site institucional e sistema de classificados da Marley-Tec.

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL (Vercel)
- NextAuth.js
- Prisma
- Cloudinary

## Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no Vercel
- Conta no Cloudinary

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/marley-tec.git
cd marley-tec
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
POSTGRES_URL="sua_url_postgres"

# NextAuth
NEXTAUTH_SECRET="sua_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

4. Inicialize o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

5. Rode o projeto em desenvolvimento:
```bash
npm run dev
```

## Deploy

O projeto está configurado para deploy automático no Vercel.

1. Faça push para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente no Vercel
4. O deploy será feito automaticamente

## Estrutura do Projeto

- `/src/app` - Rotas e API routes
- `/src/components` - Componentes React
- `/src/lib` - Utilitários e configurações
- `/src/hooks` - Custom hooks
- `/prisma` - Schema do banco de dados

## Funcionalidades

- Site institucional
- Sistema de classificados
- Painel administrativo
- Upload de imagens
- Autenticação de administrador

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
