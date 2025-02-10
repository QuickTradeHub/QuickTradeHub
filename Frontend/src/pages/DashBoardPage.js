import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaBox, FaCartPlus, FaDollarSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch('http://13.49.132.61:8080/auth/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch products
    fetch('http://13.49.132.61:3000/products?page=1&limit=10000')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Chart Data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [4000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 17000, 18000, 20000, 22000],
        fill: false,
        borderColor: '#f87171',
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: '#f87171',
      },
      {
        label: 'Users',
        data: users.map((_, index) => index * 100 + 500), // Sample data based on user count
        fill: false,
        borderColor: '#34D399',
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: '#34D399',
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Sidebar for navigation */}
      <div className="flex">
        <div className="w-64 bg-gray-800 text-white p-6 rounded-lg mr-6">
          <h2 className="text-2xl font-bold mb-6">QuickTradeHub</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/admin" className="text-lg hover:text-green-500">Dashboard</Link>
              </li>
              <li className="mb-4">
                <Link to="/admin/products" className="text-lg hover:text-green-500">Products</Link>
              </li>
              <li className="mb-4">
                <Link to="/admin/orders" className="text-lg hover:text-green-500">Orders</Link>
              </li>
              <li className="mb-4">
                <Link to="/admin/users" className="text-lg hover:text-green-500">Customers</Link>
              </li>
              <li className="mb-4">
                <Link to="/admin/reports" className="text-lg hover:text-green-500">Reports</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">Dashboard</h1>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-xl flex items-center">
              <FaUsers size={30} className="mr-4" />
              <div>
                <h3 className="font-semibold">Total Users</h3>
                <p className="text-2xl">{users.length}</p>
              </div>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-xl flex items-center">
              <FaBox size={30} className="mr-4" />
              <div>
                <h3 className="font-semibold">Total Products</h3>
                <p className="text-2xl">{products.length}</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-xl flex items-center">
              <FaCartPlus size={30} className="mr-4" />
              <div>
                <h3 className="font-semibold">Orders In Progress</h3>
                <p className="text-2xl">12</p>
              </div>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl flex items-center">
              <FaDollarSign size={30} className="mr-4" />
              <div>
                <h3 className="font-semibold">Revenue</h3>
                <p className="text-2xl">45,678</p>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
            <h2 className="font-semibold text-xl mb-4">Revenue & User Growth</h2>
            <div style={{ position: 'relative', height: '400px' }}>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Month',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Value',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Recent Activities Feed */}
          <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
            <h2 className="font-semibold text-xl mb-4">Recent Activities</h2>
            <ul>
              <li className="border-b py-3 flex justify-between">
                <span className="text-gray-800">New Order #1245</span>
                <span className="text-gray-500">2 hours ago</span>
              </li>
              <li className="border-b py-3 flex justify-between">
                <span className="text-gray-800">New User Registered</span>
                <span className="text-gray-500">3 hours ago</span>
              </li>
              <li className="border-b py-3 flex justify-between">
                <span className="text-gray-800">Product #567 Sold</span>
                <span className="text-gray-500">5 hours ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;