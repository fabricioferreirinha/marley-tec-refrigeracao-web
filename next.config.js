/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
    // Para desenvolvimento, permitir qualquer hostname
    unoptimized: process.env.NODE_ENV === 'development',
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Configurações para resolver ChunkLoadError
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Configurações específicas para desenvolvimento no client
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
  // Configuração para evitar timeouts de chunk loading e melhorar suporte ao Prisma
  experimental: {
    optimizePackageImports: ['lucide-react', '@prisma/client'],
    serverComponentsExternalPackages: ['prisma'],
  },
  
  // Configurar todas as API routes como dinâmicas por padrão
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 