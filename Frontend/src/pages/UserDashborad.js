import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('You need to log in first.');
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
      <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-center">
          <img
            src={user.profileImg || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-3xl font-bold mt-4">Welcome, {user.firstName} {user.lastName}</h1>
          <p className="text-indigo-200">{user.email}</p>
        </div>

        {/* User Info Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Account Details</h2>
            <p><strong>Username:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Roles</h2>
            {user.roles.map((role, index) => (
              <span
                key={index}
                className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
          {user.addresses.length > 0 ? (
            user.addresses.map(address => (
              <div
                key={address.addressId}
                className="bg-white p-4 mb-4 rounded-lg shadow-md border-l-4 border-indigo-600"
              >
                <p><strong>Street:</strong> {address.street}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Zip Code:</strong> {address.zipCode}</p>
                <p><strong>Country:</strong> {address.country}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No addresses found. Please add a shipping address.</p>
          )}
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-600 text-center p-4">
          <button
            onClick={() => navigate('/edit-profile')}
            className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition duration-200"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
