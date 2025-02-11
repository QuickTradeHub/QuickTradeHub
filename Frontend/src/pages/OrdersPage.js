import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import Pagination from "../components/Pagination";
import { fetchOrders } from "../utils/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const userId = JSON.parse(localStorage.getItem("user")).userId;

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrders(userId, currentPage, pageSize);
        console.log("API Response:", response);
        
        if (response && response.data && Array.isArray(response.data)) {
          setOrders(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          console.error("Unexpected API response format", response);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    getOrders();
  }, [userId, currentPage]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-6">Your Orders</h1>
      
      {/* Order List */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            order && order.id ? <OrderCard key={order.id} order={order} /> : null
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
};

export default OrdersPage;
