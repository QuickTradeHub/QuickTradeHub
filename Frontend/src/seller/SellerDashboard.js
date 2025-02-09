import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaBoxOpen, FaDollarSign, FaStar, FaTruck, FaChartLine, FaClipboardList, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const salesData = [
  { month: 'Jan', sales: 400 },
  { month: 'Feb', sales: 600 },
  { month: 'Mar', sales: 800 },
  { month: 'Apr', sales: 700 },
  { month: 'May', sales: 1000 },
  { month: 'Jun', sales: 900 },
];

export default function SellerDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-transform transform hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h2 className="text-3xl font-bold text-green-600">₹12,400</h2>
          </div>
          <FaRupeeSign className="w-10 h-10 text-green-500" />
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-transform transform hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm">Products Listed</p>
            <h2 className="text-3xl font-bold text-blue-600">85</h2>
          </div>
          <FaBoxOpen className="w-10 h-10 text-blue-500" />
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-transform transform hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <h2 className="text-3xl font-bold text-yellow-600">14</h2>
          </div>
          <FaShoppingCart className="w-10 h-10 text-yellow-500" />
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-transform transform hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <h2 className="text-3xl font-bold text-orange-600">4.8</h2>
          </div>
          <FaStar className="w-10 h-10 text-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Recent Orders</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span>Order #12345</span>
              <span className="text-green-500 font-semibold">Shipped</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Order #12346</span>
              <span className="text-yellow-500 font-semibold">Processing</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Order #12347</span>
              <span className="text-red-500 font-semibold">Pending</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Top Selling Products</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Wireless Earbuds</span>
              <span className="text-gray-600">120 sold</span>
            </li>
            <li className="flex justify-between">
              <span>Smart Watch</span>
              <span className="text-gray-600">98 sold</span>
            </li>
            <li className="flex justify-between">
              <span>Bluetooth Speaker</span>
              <span className="text-gray-600">75 sold</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Customer Feedback</h2>
          <ul className="space-y-3">
            <li className="flex flex-col">
              <span className="font-semibold">John Doe</span>
              <span className="text-gray-500">"Great quality and fast shipping!"</span>
            </li>
            <li className="flex flex-col">
              <span className="font-semibold">Jane Smith</span>
              <span className="text-gray-500">"Product as described. Satisfied!"</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Shipping Status</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Order #12348</span>
              <span className="text-green-500">Delivered</span>
            </li>
            <li className="flex justify-between">
              <span>Order #12349</span>
              <span className="text-yellow-500">In Transit</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/seller/add-product">
        <button className="bg-indigo-600 text-white rounded-2xl px-8 py-3 text-lg shadow-lg hover:bg-indigo-500 transition duration-300">
          Add New Product
        </button>
        </Link>
      </div>

      <div className="mt-10 text-center text-gray-500">
        <p className="text-sm">All data is updated in real-time to provide the latest insights for sellers.</p>
      </div>
    </div>
  );
}
