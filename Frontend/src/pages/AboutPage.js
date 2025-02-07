import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-6">About QuickTradeHub</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-4 sm:p-6 md:p-8">
        <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
          Welcome to <span className="font-bold text-indigo-600">QuickTradeHub</span> — your one-stop marketplace for buying, selling, and discovering a wide range of products. Whether you're looking for the latest gadgets, vintage finds, or everyday essentials, QuickTradeHub connects you with sellers and buyers from all over.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-2">Our Mission</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
          At QuickTradeHub, our mission is to create a seamless, secure, and enjoyable trading experience for everyone. We strive to empower individuals and businesses by providing a platform that fosters trust, convenience, and growth.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-2">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 mb-4 space-y-2">
          <li>Easy-to-use interface for quick and hassle-free transactions</li>
          <li>Secure payment and verified sellers for peace of mind</li>
          <li>Diverse categories to find exactly what you need</li>
          <li>Responsive customer support to assist you anytime</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-2">Join Our Community</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
          Become part of a growing community of trusted buyers and sellers. With QuickTradeHub, you can expand your reach, discover great deals, and make meaningful connections.
        </p>

        <p className="text-base sm:text-lg text-gray-700 mt-6 leading-relaxed">
          Thank you for choosing <span className="font-bold text-indigo-600">QuickTradeHub</span>. We look forward to helping you trade smarter and faster!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
