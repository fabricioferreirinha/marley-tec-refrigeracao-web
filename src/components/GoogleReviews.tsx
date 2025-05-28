
import React from 'react';
import { Star } from 'lucide-react';

const GoogleReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Maria Silva",
      rating: 5,
      comment: "Excelente serviço! Consertou minha geladeira rapidamente e com preço justo. Muito profissional!",
      date: "Há 2 semanas"
    },
    {
      id: 2,
      name: "João Santos",
      rating: 5,
      comment: "Instalou meu ar-condicionado split perfeitamente. Trabalho limpo e eficiente. Recomendo!",
      date: "Há 1 mês"
    },
    {
      id: 3,
      name: "Ana Costa",
      rating: 5,
      comment: "Técnico muito competente. Resolveu o problema da minha máquina de lavar no mesmo dia. Nota 10!",
      date: "Há 3 semanas"
    }
  ];

  const averageRating = 4.9;
  const totalReviews = 47;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Avaliações dos Clientes
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">{renderStars(5)}</div>
            <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
            <span className="text-gray-600">({totalReviews} avaliações no Google)</span>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja o que nossos clientes dizem sobre nosso trabalho
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">"{review.comment}"</p>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://g.co/kgs/3p9v632"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            <span>Ver Todas as Avaliações</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
