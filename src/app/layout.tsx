import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth'
import SessionStatus from '@/components/SessionStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://marley-tec.com'),
  title: 'Marley Tec - Técnico em Refrigeração | Maricá-RJ | Conserto de Ar-Condicionado, Geladeira, Fogão',
  description: 'Técnico especialista em refrigeração em Maricá-RJ. Conserto e instalação de ar-condicionado split, geladeiras, fogões, máquinas de lavar, microondas, freezers e câmaras frigoríficas. Atendimento rápido eS com garantia! Orçamento grátis.',
  keywords: 'técnico refrigeração maricá, conserto ar condicionado maricá, técnico geladeira maricá, instalação split maricá, conserto fogão maricá, técnico máquina lavar maricá, conserto microondas maricá, técnico freezer maricá, câmara frigorífica maricá, refrigeração comercial maricá',
  authors: [{ name: 'Marley Tec' }],
  creator: 'Marley Tec',
  publisher: 'Marley Tec',
  robots: 'index, follow',
  category: 'Serviços Técnicos',
  classification: 'business',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://marley-tec.com',
    title: 'Marley Tec - Técnico em Refrigeração | Maricá-RJ',
    description: 'Técnico especialista em refrigeração em Maricá-RJ. Conserto e instalação de equipamentos de refrigeração com garantia. Atendimento 24h!',
    siteName: 'Marley Tec',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Marley Tec - Técnico em Refrigeração',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marley Tec - Técnico em Refrigeração | Maricá-RJ',
    description: 'Técnico especialista em refrigeração em Maricá-RJ. Conserto e instalação com garantia. Atendimento rápido!',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://marley-tec.com',
  },
  verification: {
    google: 'your-google-verification-code', // Adicione quando tiver
  },
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#2563eb' },
      { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
    ],
    colorScheme: 'light',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Maricá" />
        <meta name="geo.position" content="-22.9194;-42.8186" />
        <meta name="ICBM" content="-22.9194, -42.8186" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Marley Tec",
              "description": "Técnico especialista em refrigeração em Maricá-RJ",
              "url": "https://marley-tec.com",
              "telephone": "+5521997496201",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Maricá",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -22.9194,
                "longitude": -42.8186
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": -22.9194,
                  "longitude": -42.8186
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Serviços de Refrigeração",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Conserto de Ar-Condicionado Split"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Conserto de Geladeiras e Freezers"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Conserto de Fogões e Microondas"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Conserto de Máquinas de Lavar"
                    }
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "127"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
          <SessionStatus />
        </AuthProvider>
      </body>
    </html>
  )
}
