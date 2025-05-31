"use client"
import React from 'react';

const BrandsCarousel = () => {
  const brands = [
    'Samsung', 'LG', 'Electrolux', 'Brastemp', 'Consul', 'Midea', 'Gree', 'Springer'
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
          🔧 Marcas que Atendemos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
              <span className="font-semibold text-gray-700">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsCarousel; 