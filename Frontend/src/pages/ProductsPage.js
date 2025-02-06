import React, { useState, useEffect } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://13.49.132.61:3000/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://13.49.132.61:3000/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = async (productId) => {
    console.log(`edit product with ${productId}`)
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Products</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{product.title}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-semibold text-green-600 mb-2">${product.price.toFixed(2)}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{product.category?.name}</span>
                  <span className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">Brand: {product.brand}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">SKU: {product.sku}</p>
                <p className="text-sm text-gray-700 mb-2">Stock: {product.stock}</p>
                <p className="text-sm text-gray-700 mb-2">Rating: {product.rating} / 5</p>
                <div className="flex items-center space-x-2 mt-4">


                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
