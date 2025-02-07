import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-blue-700 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-semibold mb-4">Welcome to QuickTradeHub</h1>
        <p className="text-lg mb-6">Your one-stop solution for seamless trading and transactions.</p>
        <a href="#products" className="bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-400 transition duration-300">Explore Products</a>
      </div>
    </section>
  );
};

export default HeroSection;
