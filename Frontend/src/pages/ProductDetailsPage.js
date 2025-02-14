import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import ProductInfo from '../components/ProductInfo';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (product?.category?._id) {
      fetchRelatedProducts();
    }
  }, [product]);

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

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`https://quicktradehub.in/productservice/products/category/${product.category._id}`);
      const data = await response.json();
      setRelatedProducts(data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center">Product not found.</div>;
  }

  return (
    <div className="p-6 mt-10 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:sticky top-0">
            <ProductCarousel images={[product.thumbnail, ...product.images]} title={product.title} />
          </div>
          <div>
            <ProductInfo product={product} />

            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-2">Shipping & Returns</h2>
              <p className="text-gray-600 text-sm">{product.shippingInformation}</p>
              <p className="text-gray-600 text-sm mt-2">Return Policy: {product.returnPolicy}</p>
            </div>
          </div>
        </div>
      </div>
      


      {/* Related Products Section */}
      <div className="max-w-5xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-2xl">
  <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {relatedProducts.map((item) => (
      <Link key={item._id} to={`/products/${item._id}`} className="block p-4 bg-gray-50 shadow rounded-lg hover:shadow-lg transition">
        <img src={item.thumbnail} alt={item.title} className="w-full h-40 object-cover mb-2 rounded" />
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-green-600 font-semibold">₹{(item.price ?? 0).toFixed(2)}</p>
      </Link>
    ))}
  </div>
</div>
            {/* Reviews Section */}
            <div className="max-w-5xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {product?.reviews?.length > 0 ? (
          <ul>
            {product.reviews.map((review, index) => (
              <li key={index} className="border-b py-4">
                <p className="font-semibold">{review.userId}</p>
                <p className="text-yellow-500">Rating: {review.rating} ⭐</p>
                <p className="text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
