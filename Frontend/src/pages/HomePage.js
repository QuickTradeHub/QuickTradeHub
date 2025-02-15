import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShippingFast, FaShieldAlt, FaUserFriends } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("https://quicktradehub.in/productservice/categories").then((res) => res.json()),
      fetch("https://quicktradehub.in/productservice/products").then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-500 py-12 px-6 text-center text-white rounded-b-2xl shadow-xl">
        <h1 className="text-5xl font-extrabold">QuickTradeHub</h1>
        <p className="text-lg mt-2">Best Deals from Trusted Sellers, Fast & Secure!</p>
        <Link to="/products" className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
          Start Shopping
        </Link>
      </header>

      {/* Trending Products */}
      <Section title="🔥 Trending Products">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Slider>
      </Section>

      {/* Categories */}
      <Section title="🎯 Explore Categories">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category._id} to={`/category/${category._id}`} className="px-6 py-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition transform hover:scale-105 text-center">
              {category.name}
            </Link>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section title="✨ Why Choose Us?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<FaShippingFast size={40} className="text-blue-500" />} title="Fast Transactions" description="Lightning-fast deals." />
          <FeatureCard icon={<FaShieldAlt size={40} className="text-green-500" />} title="Secure Payments" description="Your safety is our priority." />
          <FeatureCard icon={<FaUserFriends size={40} className="text-yellow-500" />} title="Easy to Use" description="Effortless shopping experience." />
        </div>
      </Section>

      {/* Call to Action */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">🚀 Get Started Now!</h2>
        <p className="text-lg">Join thousands of users who love QuickTradeHub.</p>
        <Link to="/register" className="mt-5 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-7 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
          Sign Up Today
        </Link>
      </section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="py-12 px-6 bg-white">
    <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">{title}</h2>
    {children}
  </section>
);

const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="p-3">
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <img src={product.thumbnail} alt={product.name} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
        <p className="text-sm opacity-90 mb-1">{product.description}</p>
        <p className="text-yellow-400 font-bold text-lg">₹{product.price}</p>
      </div>
    </div>
  </Link>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-3 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h4 className="text-2xl font-bold mb-2 text-gray-800">{title}</h4>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);

export default HomePage;
