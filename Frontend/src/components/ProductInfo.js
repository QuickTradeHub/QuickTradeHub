import React from 'react';

const ProductInfo = ({ product }) => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-semibold text-gray-800 mb-4">{product.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{product.description}</p>
      <p className="text-3xl font-semibold text-green-600 mb-4">${product.price.toFixed(2)}</p>

      <div className="flex items-center mb-4 space-x-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {product.category?.name}
        </span>
        <span className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
          Brand: {product.brand}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-2">In Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
      <p className="text-sm text-yellow-500 mb-4">
        Rating: {product.rating.rate} / 5 ⭐ ({product.rating.count} reviews)
      </p>

      <div className="flex gap-4">
        <button 
          className={`px-6 py-3 w-full text-white rounded-lg transition ${product.stock > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

        <button 
          className={`px-6 py-3 w-full text-white rounded-lg transition ${product.stock > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
