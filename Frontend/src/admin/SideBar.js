import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 text-center text-2xl">QuickTradeHub</div>
      <ul className="space-y-4 mt-6">
        <li><Link to="/" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/products" className="block p-2 hover:bg-gray-700 rounded">Products</Link></li>
        <li><Link to="/orders" className="block p-2 hover:bg-gray-700 rounded">Orders</Link></li>
        <li><Link to="/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link></li>
        <li><Link to="/settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
