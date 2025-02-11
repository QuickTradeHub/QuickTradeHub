import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 3;
  const userId = JSON.parse(localStorage.getItem("user")).userId;

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://13.49.132.61:5142/api/orders/user/${userId}?page=${currentPage}&pageSize=${pageSize}`
        );
        const result = await response.json();

        if (result && result.data && Array.isArray(result.data)) {
          const ordersWithProductDetails = await Promise.all(
            result.data.map(async (order) => {
              const detailedItems = await Promise.all(
                order.orderItems.map(async (item) => {
                  const productResponse = await fetch(
                    `http://13.49.132.61:3000/products/${item.productId}`
                  );
                  const productDetails = await productResponse.json();
                  return { ...item, productDetails };
                })
              );
              return { ...order, orderItems: detailedItems };
            })
          );

          setOrders(ordersWithProductDetails);
          setTotalPages(result.totalPages || 1);
        } else {
          console.error("Unexpected API response format", result);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [userId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-6">Your Orders</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Order #{order.id}</h2>
                <p className="text-gray-700 mb-2">Status: {order.status === 0 ? "Pending" : "Completed"}</p>
                <p className="text-gray-700 mb-2">Total: ${order.totalAmount}</p>
                <p className="text-gray-700 mb-4">Date: {new Date(order.createdDate).toLocaleDateString()}</p>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img src={item.productDetails.thumbnail} alt={item.productDetails.title} className="w-20 h-20 rounded-xl object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold">{item.productDetails.title}</h3>
                        <p className="text-gray-600">{item.productDetails.description.substring(0, 50)}...</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">Price: ${item.unitPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
