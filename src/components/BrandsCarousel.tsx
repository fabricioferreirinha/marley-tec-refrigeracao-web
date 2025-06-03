"use client"
import React from 'react';
import Image from 'next/image';

const BrandsCarousel = () => {
  // Array com as marcas e seus arquivos de logo
  const brands = [
    { name: 'Samsung', logo: 'samsung-300x169.png.webp' },
    { name: 'LG', logo: 'lg-300x169.png.webp' },
    { name: 'Electrolux', logo: 'electrolux-300x169.png.webp' },
    { name: 'Brastemp', logo: 'brastemp-300x169.png.webp' },
    { name: 'Consul', logo: 'consul-300x169.png.webp' },
    { name: 'Midea', logo: 'midea-300x169.png.webp' },
    { name: 'Springer', logo: 'springer-300x169.png.webp' },
    { name: 'Panasonic', logo: 'panasonic-300x169.png.webp' },
    { name: 'Philco', logo: 'philco-300x169.png.webp' },
    { name: 'Fujitsu', logo: 'fujitsu-300x169.png.webp' },
    { name: 'Elgin', logo: 'elgin-300x169.png.webp' },
    { name: 'Carrier', logo: 'carrier-300x169.png.webp' }
  ];

  // Duplicar o array 3 vezes para garantir loop suave
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Título da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
            Especialista nas{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Principais Marcas
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Atendemos e consertamos equipamentos de todas as principais marcas do mercado
          </p>
        </div>

        {/* Container do carrossel */}
        <div className="relative">
          <div 
            className="overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <div 
              className="flex space-x-8"
              style={{
                width: 'max-content',
                animation: 'brands-scroll 60s linear infinite'
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="group flex-shrink-0 w-48 h-28 bg-gray-100 rounded-xl flex items-center justify-center px-6 py-4 transition-all duration-300 hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  <Image
                    src={`/marcas/${brand.logo}`}
                    alt={`Logo ${brand.name}`}
                    width={180}
                    height={101}
                    className="max-w-full max-h-full object-contain transition-all duration-300 brand-logo"
                    loading="lazy"
                    style={{
                      filter: 'brightness(0) saturate(0) invert(0.3)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gradientes laterais para efeito de máscara */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes brands-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
      `}</style>
    </section>
  );
};

export default BrandsCarousel; 