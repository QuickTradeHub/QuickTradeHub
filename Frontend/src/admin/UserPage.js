import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPhone, FaEnvelope, FaUser, FaRegClock, FaRegEye, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data from the API
  useEffect(() => {
    axios
      .get("https://quicktradehub.in/authenticationservice/auth/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setLoading(false);
      });
  }, []);

  // Placeholder for users without a profile image
  const defaultProfileImage = "https://via.placeholder.com/150";

  // Separate buyers and sellers
  const buyers = users.filter(user => user.roles?.includes("BUYER"));
  const sellers = users.filter(user => user.roles?.includes("SELLER"));

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-extrabold text-center text-white mb-12 tracking-tight">
          QuickTradeHub Users
        </h2>

        {/* Sellers Section */}
        <div className="mb-10">
          <h3 className="text-3xl font-semibold text-white mb-6">Sellers</h3>
          {loading ? (
            <div className="text-center text-xl text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {sellers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-white p-6 rounded-3xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                  {/* User Profile Image */}
                  <div className="flex justify-center mb-6 relative">
                    <img
                      src={user.profileImg || defaultProfileImage}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-indigo-600 shadow-md"
                    />
                    <div
                      className={`absolute top-0 left-0 w-full h-full rounded-full bg-opacity-50 ${
                        user.status === "ACTIVE" ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                  </div>

                  {/* User Details */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-lg text-gray-600">{user.userName}</p>

                    {/* User Information */}
                    <div className="mt-4 text-gray-500 space-y-2">
                      <div className="flex items-center justify-center">
                        <FaEnvelope className="text-indigo-500 mr-2" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaPhone className="text-indigo-500 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaUser className="text-indigo-500 mr-2" />
                        <span>{user.roles.join(", ")}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaRegClock className="text-indigo-500 mr-2" />
                        <span>
                        Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}

                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-block py-1 px-4 text-white rounded-full ${
                          user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link to={`/admin/users/profile/${user.userId}`}></Link>
                  <button className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-105 flex items-center justify-center">
                    <FaRegEye className="mr-2" />
                    View Profile
                  </button>
                  <Link/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buyers Section */}
        <div>
          <h3 className="text-3xl font-semibold text-white mb-6">Buyers</h3>
          {loading ? (
            <div className="text-center text-xl text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {buyers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-white p-6 rounded-3xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                  {/* User Profile Image */}
                  <div className="flex justify-center mb-6 relative">
                    <img
                      src={user.profileImg || defaultProfileImage}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-indigo-600 shadow-md"
                    />
                    <div
                      className={`absolute top-0 left-0 w-full h-full rounded-full bg-opacity-50 ${
                        user.status === "ACTIVE" ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                  </div>

                  {/* User Details */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-lg text-gray-600">{user.userName}</p>

                    {/* User Information */}
                    <div className="mt-4 text-gray-500 space-y-2">
                      <div className="flex items-center justify-center">
                        <FaEnvelope className="text-indigo-500 mr-2" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaPhone className="text-indigo-500 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaUser className="text-indigo-500 mr-2" />
                        <span>{user.roles.join(", ")}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <FaRegClock className="text-indigo-500 mr-2" />
                        <span>
                        Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-block py-1 px-4 text-white rounded-full ${
                          user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Link to={`/admin/users/profile/${user.userId}`}>
                  <button className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-105 flex items-center justify-center">
                    <FaRegEye className="mr-2" />
                    View Profile
                  </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
