import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaShippingFast, FaShieldAlt, FaUserFriends, FaStar, FaHeadset, FaTags } from "react-icons/fa";

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    fetch("https://quicktradehub.in/productservice/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center text-center py-20 px-4 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://via.placeholder.com/1500x800")' }}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fadeIn text-shadow-lg">
            Your Ultimate Marketplace
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mb-8 animate-fadeIn delay-200">
            Buy and sell products effortlessly with QuickTradeHub. Experience seamless transactions and a user-friendly platform tailored just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fadeIn delay-400"
            >
              Explore Products
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-200 text-purple-600 font-semibold px-8 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fadeIn delay-600"
            >
              Join Now
            </Link>
          </div>
        </main>

        {/* Features Section */}
        <section className="bg-white text-gray-800 py-16 px-4 md:px-20">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose QuickTradeHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<FaShippingFast size={40} />} title="Fast Transactions" description="Experience lightning-fast transactions with our optimized platform." />
            <FeatureCard icon={<FaShieldAlt size={40} />} title="Secure Payments" description="Your security is our priority. All transactions are encrypted and safe." />
            <FeatureCard icon={<FaUserFriends size={40} />} title="User-Friendly Interface" description="Navigate effortlessly through our intuitive and clean interface." />
            <FeatureCard icon={<FaHeadset size={40} />} title="24/7 Support" description="Our support team is available around the clock to assist you." />
            <FeatureCard icon={<FaTags size={40} />} title="Best Deals" description="Find unbeatable deals and offers on a wide range of products." />
            <FeatureCard icon={<FaStar size={40} />} title="Top Rated Sellers" description="Shop with confidence from our highly-rated and trusted sellers." />
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-gray-100 text-gray-800 py-16 px-4 md:px-20">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                  <h4 className="text-xl font-semibold mb-2">{category.name}</h4>
                  <Link to={`/category/${category._id}`} className="text-purple-600 hover:underline">Explore</Link>
                </div>
              ))
            ) : (
              <p className="text-center">Loading categories...</p>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4 md:px-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join thousands of users who trust QuickTradeHub for their buying and selling needs.</p>
          <Link
            to="/register"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
    <div className="flex justify-center mb-4 text-purple-600">{icon}</div>
    <h4 className="text-2xl font-bold mb-2">{title}</h4>
    <p>{description}</p>
  </div>
);

export default HomePage;
