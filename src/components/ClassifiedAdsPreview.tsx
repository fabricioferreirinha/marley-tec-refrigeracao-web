"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Eye, X } from 'lucide-react';
import Link from 'next/link';

interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  whatsappMessage: string;
  createdAt: string;
  isActive: boolean;
}

const ClassifiedAdsPreview = () => {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAd, setSelectedAd] = useState<ClassifiedAd | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Geladeira', 'Maquina de Lavar', 'Microondas', 'Freezer', 'Ar-Condicionado', 'Outro'];

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/classified-ads?active=true');
        if (response.ok) {
          const data = await response.json();
          setAds(data.ads.slice(0, 6)); // Mostrar apenas os 6 mais recentes
        }
      } catch (error) {
        console.error('Erro ao buscar classificados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  const adsPerPage = 3;
  const adsPerPageMobile = 1; // Separando para mobile
  const totalPages = Math.ceil(ads.length / adsPerPage);
  const totalPagesMobile = Math.ceil(ads.length / adsPerPageMobile);

  // Detectar se é mobile para ajustar a paginação
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentTotalPages = isMobile ? totalPagesMobile : totalPages;
  const currentAdsPerPage = isMobile ? adsPerPageMobile : adsPerPage;

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? currentTotalPages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      (prevIndex + 1) % currentTotalPages
    );
  };

  const openModal = (ad: ClassifiedAd) => {
    setSelectedAd(ad);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedAd(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAd && currentImageIndex < selectedAd.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleWhatsAppContact = (ad: ClassifiedAd) => {
    const phoneNumber = "5521999999999"; // Número do WhatsApp
    const message = encodeURIComponent(ad.whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Novo': return 'bg-green-100 text-green-800';
      case 'Excelente': return 'bg-blue-100 text-blue-800';
      case 'Muito Bom': return 'bg-yellow-100 text-yellow-800';
      case 'Bom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null; // Não mostrar seção se não houver anúncios
  }

  return (
    <>
      <section className="classified-preview-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Eletrodomésticos Usados</h2>
            <p className="text-lg text-gray-600 mb-8">
              Encontre equipamentos de qualidade com preços especiais
            </p>
            
            {/* Botão destacado para ver todos */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link 
                href="/classificados"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Eye className="w-6 h-6" />
                Ver Todos os Classificados
              </Link>
              
              {/* Controles do carrossel */}
              {currentTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToPrevious}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200 shadow-md"
                    aria-label="Classificados anteriores"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm text-gray-500 mx-2">
                    {currentIndex + 1} de {currentTotalPages}
                  </span>
                  
                  <button 
                    onClick={goToNext}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200 shadow-md"
                    aria-label="Próximos classificados"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Carrossel de Classificados */}
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: currentTotalPages }).map((_, pageIndex) => (
                  <div key={pageIndex} className="min-w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                      {ads.slice(pageIndex * currentAdsPerPage, (pageIndex + 1) * currentAdsPerPage).map((ad) => (
                        <div key={ad.id} className="classified-card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full max-w-sm mx-auto lg:max-w-none flex flex-col h-full">
                          {/* Imagem */}
                          <div 
                            className="relative h-52 bg-gray-200"
                            onClick={() => openModal(ad)}
                          >
                            {ad.images.length > 0 ? (
                              <img 
                                src={ad.images[0]} 
                                alt={ad.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-product.svg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-gray-400">Sem imagem</span>
                              </div>
                            )}
                            
                            {/* Badge de condição */}
                            <div className="absolute top-3 right-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(ad.condition)}`}>
                                {ad.condition}
                              </span>
                            </div>

                            {/* Indicador de clique */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <span className="text-white font-medium bg-blue-600 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Clique para ver detalhes
                              </span>
                            </div>
                          </div>

                          {/* Conteúdo - flex-1 para ocupar espaço disponível */}
                          <div 
                            className="p-6 flex-1 flex flex-col"
                            onClick={() => openModal(ad)}
                          >
                            <div className="mb-3">
                              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{ad.title}</h3>
                              <p className="text-sm text-gray-500">ID: {ad.id}</p>
                            </div>

                            <p className="text-gray-700 text-sm mb-4 flex-1" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical' as const,
                              overflow: 'hidden'
                            }}>
                              {ad.description}
                            </p>

                            {/* Preço */}
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-green-600">
                                {formatPrice(ad.price)}
                              </span>
                            </div>
                          </div>

                          {/* Botão de Contato - sempre na parte inferior */}
                          <div className="px-6 pb-6 mt-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppContact(ad);
                              }}
                              className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Entrar em Contato
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores de página */}
            {currentTotalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-3">
                {Array.from({ length: currentTotalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-full transition-all duration-300 shadow-sm ${
                      index === currentIndex ? 'w-10 h-4 bg-blue-600' : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para página ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Chamada para Ação - Anunciar no WhatsApp */}
      <section className="py-12 bg-gradient-to-r from-marley-blue to-marley-blue-dark">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Quer Vender Seu Eletrodoméstico?
            </h3>
            <p className="text-lg mb-6 text-blue-100 max-w-2xl mx-auto">
              Entre em contato conosco via WhatsApp e anuncie seu produto na nossa plataforma. 
              Ajudamos você a encontrar o comprador ideal!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => {
                  const phoneNumber = "5521997496201";
                  const message = encodeURIComponent(
                    "Olá! Tenho um eletrodoméstico para vender e gostaria de anunciar na plataforma da Marley-Tec. Podem me ajudar?"
                  );
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="inline-flex items-center gap-2 bg-marley-green hover:bg-marley-green-dark text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" />
                Anunciar via WhatsApp
              </button>
              
              <div className="text-sm text-blue-100">
                <p>🚀 Divulgação gratuita</p>
                <p>📱 Contato direto com compradores</p>
                <p>⚡ Publicação rápida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Detalhes */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{selectedAd.title}</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Carrossel de Imagens */}
                <div className="relative">
                  {selectedAd.images.length > 0 ? (
                    <>
                      <img 
                        src={selectedAd.images[currentImageIndex]} 
                        alt={selectedAd.title}
                        className="w-full h-64 md:h-96 object-contain rounded-lg bg-gray-50 border"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.svg';
                        }}
                      />
                      
                      {selectedAd.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full disabled:opacity-50 hover:bg-opacity-70 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={currentImageIndex === selectedAd.images.length - 1}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full disabled:opacity-50 hover:bg-opacity-70 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {selectedAd.images.length}
                          </div>
                        </>
                      )}

                      {/* Miniaturas das imagens */}
                      {selectedAd.images.length > 1 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 thumbnail-scroll">
                          {selectedAd.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all duration-200 ${
                                index === currentImageIndex ? 'border-blue-500 scale-110' : 'border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${selectedAd.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-product.svg';
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(selectedAd.condition)}`}>
                      {selectedAd.condition}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(selectedAd.price)}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">ID: {selectedAd.id}</p>
                    <p className="text-sm text-gray-500">Publicado em: {formatDate(selectedAd.createdAt)}</p>
                  </div>

                  <div className="mb-6 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedAd.description}</p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => handleWhatsAppContact(selectedAd)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Entrar em Contato
                    </button>
                    
                    <Link
                      href="/classificados"
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                      Ver Todos os Classificados
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassifiedAdsPreview; 