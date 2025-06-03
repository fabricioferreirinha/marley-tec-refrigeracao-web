import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://marley-tec.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/classificados',
        '/sitemap.xml',
        '/logo.svg',
        '/tecnico.png',
        '/og-image.jpg',
      ],
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/private/',
        '*.json',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 