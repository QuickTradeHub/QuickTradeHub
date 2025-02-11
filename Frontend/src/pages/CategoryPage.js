import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products based on the categoryId
    fetch(`http://13.49.132.61:3000/products/category/${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Category Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4 md:px-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Explore Products in this Category</h2>
        <p className="text-lg mb-8">Find the best products under this category, curated just for you!</p>
      </section>

      {/* Product List Section */}
      <section className="py-16 px-4 md:px-20">
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="text-center col-span-full">No products found in this category.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
