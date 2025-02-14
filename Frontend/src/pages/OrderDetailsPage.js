import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const OrderDetailsPage = () => {
  const { userId } = JSON.parse(localStorage.getItem("user")) || {};
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://quicktradehub.in/orderservice/api/orders/${orderId}`
        );
        const result = await response.json();

        if (result?.orderItems) {
          const orderWithDetails = await Promise.all(
            result.orderItems.map(async (item) => {
              const productResponse = await fetch(
                `https://quicktradehub.in/productservice/products/${item.productId}`
              );
              const productDetails = await productResponse.json();
              return { ...item, productDetails };
            })
          );
          setOrder({ ...result, orderItems: orderWithDetails });
        } else {
          setError("Invalid order data.");
        }
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleReviewSubmit = async (productId) => {
    if (!ratings[productId] || !comments[productId]) {
      alert("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await fetch(
        `https://quicktradehub.in/productservice/products/${productId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            rating: ratings[productId],
            comment: comments[productId],
          }),
        }
      );

      if (response.ok) {
        setReviews((prev) => ({ ...prev, [productId]: true }));
        alert("Review submitted successfully!");
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review.");
    }
  };

  const StarRating = ({ productId }) => {
    return (
      <div className="flex space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            className={`cursor-pointer text-2xl ${ratings[productId] >= num ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRatings((prev) => ({ ...prev, [productId]: num }))}
          />
        ))}
      </div>
    );
  };

  if (loading) return <p className="text-center text-gray-500">Loading order details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">Order #{order.id} Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {["shippingAddress", "billingAddress"].map((type) => (
          <div key={type} className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 capitalize">{type.replace("Address", " Address")}</h2>
            <p className="text-gray-600">{order[type]?.street}, {order[type]?.city}</p>
            <p className="text-gray-600">{order[type]?.state}, {order[type]?.zipCode}</p>
            <p className="text-gray-600">{order[type]?.country}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-semibold text-blue-600 mt-10">Order Items</h2>
      <div className="mt-6 space-y-6">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex flex-col p-6 border rounded-xl shadow-lg bg-gray-50">
            <div className="flex items-center space-x-6">
              <img src={item.productDetails.thumbnail} alt={item.productDetails.title} className="w-28 h-28 rounded-lg object-cover shadow-md" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{item.productDetails.title}</h3>
                <p className="text-sm text-gray-500">{item.productDetails.description.substring(0, 50)}...</p>
                <p className="text-md font-medium text-gray-700">Quantity: {item.quantity} | Price: ₹{item.unitPrice}</p>
              </div>
            </div>

            {!reviews[item.productId] && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700">Add a Review</h4>
                <StarRating productId={item.productId} />
                <textarea
                  className="border p-3 mt-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your review..."
                  value={comments[item.productId] || ""}
                  onChange={(e) => setComments((prev) => ({ ...prev, [item.productId]: e.target.value }))}
                />
                <button onClick={() => handleReviewSubmit(item.productId)} className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                  Submit Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center bg-blue-100 p-4 rounded-lg">
        <p className="text-2xl font-bold text-gray-800">Total: ₹{order.totalAmount}</p>
        <p className={`text-xl font-semibold px-5 py-2 rounded-full ${order.status === 2 ? "bg-green-400" : "bg-yellow-400"}`}>{order.status === 2 ? "Delivered" : "Pending"}</p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
