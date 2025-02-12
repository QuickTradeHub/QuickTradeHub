import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import ProductInfo from '../components/ProductInfo';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false); // Track if the product is added to cart
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  useEffect(() => {
    const isProductInCart = cart.some(item => item.id === productId);
    setAddedToCart(isProductInCart); // Check if product is already in the cart
  }, [cart, productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://quicktradehub.in/productservice/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (addedToCart) {
      dispatch(removeFromCart(product));
      setAddedToCart(false);
    } else {
      dispatch(addToCart(product));
      setAddedToCart(true);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center">Product not found.</div>;
  }

  return (
    <div className="p-6 mt-10 bg-gray-100 min-h-screen static">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Make sure ProductCarousel stays inside the layout */}
          <div className="lg:sticky top-0">
            <ProductCarousel images={[product.thumbnail, ...product.images]} title={product.title} />
          </div>
          <div>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
