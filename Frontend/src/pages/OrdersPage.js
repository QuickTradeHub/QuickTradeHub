import React, { useEffect, useState, useRef, useCallback } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const pageSize = 3;
  const {userId} = JSON.parse(localStorage.getItem("user"));

  const getOrders = useCallback(async () => {
    if (loading || !hasMore) {return};
    setLoading(true);
    try {
      const response = await fetch(
        `https://quicktradehub.in/orderservice/api/orders/user/${userId}?page=${currentPage}&pageSize=${pageSize}`
      );
      const result = await response.json();

      if (result && result.data && Array.isArray(result.data)) {
        const ordersWithProductDetails = await Promise.all(
          result.data.map(async (order) => {
            const detailedItems = await Promise.all(
              order.orderItems.map(async (item) => {
                const productResponse = await fetch(
                  `https://quicktradehub.in/productservice/products/${item.productId}`
                );
                const productDetails = await productResponse.json();
                return { ...item, productDetails };
              })
            );
            return { ...order, orderItems: detailedItems };
          })
        );

        setOrders((prevOrders) => {
          const newOrders = ordersWithProductDetails.filter(
            (newOrder) => !prevOrders.some((order) => order.id === newOrder.id)
          );
          return [...prevOrders, ...newOrders];
        });

        setHasMore(result.data.length === pageSize);
      } else {
        setHasMore(false);
        console.error("Unexpected API response format", result);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, loading, hasMore]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const lastOrderElementRef = useRef(null);

  useEffect(() => {
    if (loading) {return};
    if (observer.current) {observer.current.disconnect()};

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });

    if (lastOrderElementRef.current) {
      observer.current.observe(lastOrderElementRef.current);
    }
  }, [loading, hasMore]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center my-8 text-blue-700">Your Orders</h1>

      {orders.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order, index) => (
            <div
              key={order.id}
              ref={orders.length === index + 1 ? lastOrderElementRef : null}
              className="transition-all transform hover:scale-105 shadow-xl rounded-xl p-6 bg-white hover:bg-blue-50"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                Order #{order.id}
              </h2>
              <div className="flex items-center space-x-2 mb-3">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 0 ? "bg-yellow-300 text-gray-800" : "bg-green-300 text-gray-800"
                  }`}
                >
                  {order.status === 0 ? "Pending" : "Completed"}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-3">
                Total: <span className="text-blue-600">₹{order.totalAmount}</span>
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Date: {new Date(order.createdDate).toLocaleDateString()}
              </p>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-6">
                    <img
                      src={item.productDetails.thumbnail}
                      alt={item.productDetails.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productDetails.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.productDetails.description.substring(0, 50)}...
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price:₹{item.unitPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {!hasMore && orders.length > 0 && (
        <p className="text-center text-gray-500 mt-6">No more orders to load.</p>
      )}
    </div>
  );
};

export default OrdersPage;
