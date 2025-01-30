import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const user = useSelector((state) => state.user); // Assuming the user info is stored in state.user
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can dispatch an action to clear user data here
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold text-blue-600">You need to log in first</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <p className="w-full p-3 mt-2 border border-gray-300 rounded-lg">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <p className="w-full p-3 mt-2 border border-gray-300 rounded-lg">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <p className="w-full p-3 mt-2 border border-gray-300 rounded-lg">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
