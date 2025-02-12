import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser, FaRegClock, FaShoppingCart } from "react-icons/fa";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://quicktradehub.in/authenticationservice/auth/users/${userId}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600">
        <div className="text-white text-2xl">User not found</div>
      </div>
    );
  }

  const defaultProfileImage = "https://via.placeholder.com/150";

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <Link to="/users" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Users
        </Link>

        <div className="flex flex-col items-center">
          <img
            src={user.profileImg || defaultProfileImage}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full border-4 border-indigo-600 shadow-md mb-4"
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-xl text-gray-600 mb-4">@{user.userName}</p>

          <div className="text-gray-500 space-y-2 text-lg">
            <div className="flex items-center">
              <FaEnvelope className="text-indigo-500 mr-2" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-indigo-500 mr-2" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center">
              <FaUser className="text-indigo-500 mr-2" />
              <span>{user.roles.join(", ")}</span>
            </div>
            <div className="flex items-center">
              <FaRegClock className="text-indigo-500 mr-2" />
              <span>
                Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <span
              className={`py-1 px-4 text-white rounded-full text-lg ${
                user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Activity Summary</h3>
          <div className="flex justify-around">
            <div className="flex items-center text-gray-700">
              <FaShoppingCart className="text-indigo-500 mr-2" />
              <span>Orders: {user.ordersCount || 0}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaShoppingCart className="text-indigo-500 mr-2" />
              <span>Products Listed: {user.productsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
