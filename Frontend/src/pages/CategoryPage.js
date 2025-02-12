import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products based on the categoryId
    fetch(`https://quicktradehub.in/productservice/products/category/${categoryId}`)
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
      <section className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-16 px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Products in this Category</h2>
        <p className="text-lg md:text-xl mb-8">Find the best products curated just for you, handpicked from this category.</p>
      </section>

      {/* Product List Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        {loading ? (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="text-center col-span-full text-lg text-gray-500">No products found in this category.</div>
            )}
          </div>
        )}
      </section>


    </div>
  );
};

export default CategoryPage;
