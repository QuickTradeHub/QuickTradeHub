import React, { useEffect, useState } from "react";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await fetch("https://quicktradehub.in/orderservice/api/orders");
        const ordersData = await orderResponse.json();

        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const orderItems = await Promise.all(
              order.orderItems.map(async (item) => {
                const productResponse = await fetch(`https://quicktradehub.in/productservice/products/${item.productId}`);
                const productData = await productResponse.json();
                
                const sellerResponse = await fetch(`https://quicktradehub.in/authenticationservice/auth/user/${item.sellerId}`);
                const sellerData = await sellerResponse.json();

                return {
                  ...item,
                  productName: productData.title,
                  productImage: productData.thumbnail,
                  sellerName: sellerData.firstName + " " + sellerData.lastName,
                };
              })
            );

            return {
              ...order,
              orderItems,
            };
          })
        );

        setOrders(enrichedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://quicktradehub.in/orderservice/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-2xl font-semibold text-gray-600 animate-pulse">Loading orders...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Admin Orders Dashboard</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-2xl rounded-3xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Order ID: <span className="text-blue-600">{order.id}</span></h2>
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-2 text-sm font-medium rounded-full ${statusClasses(order.status)}`}>
                  {statusMap[order.status]}
                </span>
                <select
                  className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, parseInt(e.target.value))}
                >
                  {Object.entries(statusMap).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong className="text-gray-600">Total Amount:</strong> <span className="text-green-600 font-semibold">${order.totalAmount}</span>
              </div>
              <div>
                <strong className="text-gray-600">Payment Status:</strong> <span className={`${paymentStatusClasses(order.paymentStatus)} font-semibold`}>{paymentStatusMap[order.paymentStatus]}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong className="text-gray-600">Shipping Address:</strong>
                <p className="text-gray-700">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
              </div>
              <div>
                <strong className="text-gray-600">Billing Address:</strong>
                <p className="text-gray-700">{order.billingAddress.street}, {order.billingAddress.city}, {order.billingAddress.state}, {order.billingAddress.zipCode}, {order.billingAddress.country}</p>
              </div>
            </div>
            <div>
              <strong className="text-gray-600">Order Items:</strong>
              <ul className="mt-2 space-y-4">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity} | Unit Price: ₹{item.unitPrice}</p>
                      <p className="text-sm text-gray-600"><strong>Seller:</strong> {item.sellerName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusMap = {
  0: "Pending",
  1: "Shipped",
  2: "Delivered",
  3: "Cancelled",
};

const paymentStatusMap = {
  0: "Unpaid",
  1: "Paid",
  2: "Refunded",
};

const statusClasses = (status) => {
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-800";
    case 1:
      return "bg-blue-100 text-blue-800";
    case 2:
      return "bg-green-100 text-green-800";
    case 3:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const paymentStatusClasses = (paymentStatus) => {
  switch (paymentStatus) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-green-600";
    case 2:
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

export default AdminOrdersPage;
