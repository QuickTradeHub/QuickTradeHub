import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("You need to log in first.");
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-8 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white text-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-center relative">
          <img
            src={user.profileImg || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition duration-300"
          />
          <h1 className="text-4xl font-extrabold mt-4 text-white drop-shadow-lg">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-indigo-200 mt-2 text-lg">{user.email}</p>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => navigate("/orders")}
              className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300"
            >
              View Orders
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              Account Details
            </h2>
            <p className="mb-2">
              <strong>Username:</strong> {user.userName}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {user.status}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {new Date(user.lastLogin).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              Roles
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role, index) => (
                <span
                  key={index}
                  className="inline-block bg-indigo-100 text-indigo-800 text-sm px-4 py-2 rounded-full shadow-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-8">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-600">
            Saved Addresses
          </h2>
          {user.addresses.length > 0 ? (
            user.addresses.map((address) => (
              <div
                key={address.addressId}
                className="bg-white p-6 mb-4 rounded-2xl shadow-md border-l-4 border-indigo-600 hover:shadow-lg transition duration-300"
              >
                <p>
                  <strong>Street:</strong> {address.street}
                </p>
                <p>
                  <strong>City:</strong> {address.city}
                </p>
                <p>
                  <strong>State:</strong> {address.state}
                </p>
                <p>
                  <strong>Zip Code:</strong> {address.zipCode}
                </p>
                <p>
                  <strong>Country:</strong> {address.country}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg">
              No addresses found. Please add a shipping address.
            </p>
          )}
        </div>

        {/* Footer Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-center p-6">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
