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
        const { data, totalPages } = await fetchOrders(userId, currentPage, pageSize);
        setOrders(data);
        setTotalPages(totalPages);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default OrdersPage;
