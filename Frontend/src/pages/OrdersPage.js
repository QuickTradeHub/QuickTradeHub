import React, { useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    { orderId: 'ORD001', customer: 'John Doe', amount: '$30', status: 'Shipped' },
    { orderId: 'ORD002', customer: 'Jane Smith', amount: '$50', status: 'Pending' },
    // More orders here
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{order.orderId}</td>
              <td className="border px-4 py-2">{order.customer}</td>
              <td className="border px-4 py-2">{order.amount}</td>
              <td className="border px-4 py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
