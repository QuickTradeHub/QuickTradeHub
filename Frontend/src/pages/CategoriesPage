import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaTag, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

const CategoriesPage = () => {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await fetch(`http://13.49.132.61:3000/categories/${categoryName}`);
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        const productsResponse = await fetch(`http://13.49.132.61:3000/products?category=${categoryName}`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">
        {/* Category Header Section */}
        <main className="py-20 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{category.name}</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-4xl mx-auto">{category.description}</p>
        </main>

        {/* Products Section */}
        <section className="bg-white text-gray-800 py-16 px-4 md:px-20">
          <h2 className="text-4xl font-bold text-center mb-12">Products in {category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                  <p className="text-lg text-gray-600 mb-4">${product.price}</p>
                  <Link to={`/product/${product.id}`} className="text-purple-600 hover:underline">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center">No products found in this category.</p>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4 md:px-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Want to sell products in this category?</h2>
          <p className="text-lg mb-8">Join QuickTradeHub today and start selling your products in this category!</p>
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

export default CategoriesPage;
