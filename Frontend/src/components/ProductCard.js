import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom'; 

const ProductCard = ({ product, onAddToWishlist }) => (
  <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative">
    <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover" />
    <button 
      onClick={() => onAddToWishlist(product)} 
      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
    >
      <Heart className="text-red-500 w-5 h-5" />
    </button>
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{product.title}</h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
      <p className="text-lg font-semibold text-green-600 mb-2">${product.price.toFixed(2)}</p>

      <div className="flex items-center justify-between mb-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          {product.category?.name}
        </span>
        <span className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
          Brand: {product.brand}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-2">In Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
      
      <p className="text-sm text-yellow-500 mb-2">
        Rating: {product.rating.rate} / 5 ⭐ ({product.rating.count} reviews)
      </p>

      <div className="flex items-center space-x-2 mt-4">
      <Link to={`/products/${product._id}`}>
        <button 
          className="px-4 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          View Details
        </button>
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
