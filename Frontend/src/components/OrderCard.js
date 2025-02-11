import React from "react";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-bold">{order.productName}</h3>
      <p className="text-gray-600">{order.status}</p>
      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
      <div className="mt-4">
        <span className="text-lg font-semibold text-green-600">{order.totalPrice} USD</span>
      </div>
    </div>
  );
};

export default OrderCard;
