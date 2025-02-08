import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // Get the wishlist from the Redux store
  const wishlist = useSelector((state) => state.wishlist.items);

  // Check if the product is in the wishlist
  const isInWishlist = wishlist.some((item) => item._id === product?._id);

  // Handler for adding/removing product from wishlist
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id)); // Remove from wishlist
    } else {
      dispatch(addToWishlist(product)); // Add to wishlist
    }
  };

  // Guard clause to prevent errors if product details are missing
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative">
            {/* Wishlist Button */}
            <button 
        onClick={handleWishlistToggle} 
        className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${isInWishlist ? 'bg-gray-900' : 'bg-white'}`}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? 'text-white' : 'text-red-500'}`} />
      </button>
      <Link to={`/products/${product?._id}`}>
      <img 
        src={product?.thumbnail || 'default_image_url'} 
        alt={product?.title || 'Product Image'} 
        className="w-full h-48 object-cover" 
      />



      
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{product?.title}</h2>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product?.description}</p>
          <p className="text-lg font-semibold text-green-600 mb-2">₹{product?.price?.toFixed(2) || 'N/A'}</p>

          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {product?.category?.name || 'No Category'}
            </span>
            <span className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
              Brand: {product?.brand || 'Unknown'}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-2">In Stock: {product?.stock > 0 ? product?.stock : 'Out of Stock'}</p>

          <p className="text-sm text-yellow-500 mb-2">
            Rating: {product?.rating?.rate || 0} / 5 ⭐ ({product?.rating?.count || 0} reviews)
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
