import React, { useState, useEffect } from 'react';

const EditProfilePage = () => {
  // State to hold user data
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImg: '',
    addresses: [],
  });

  // Effect to fetch and populate user data from localStorage or API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImg: user.profileImg || '',
        addresses: user.addresses || [],
      });
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...userData, ...formData };
    console.log(updatedUser);

    try {
      const response = await fetch('https://quicktradehub.in/authenticationservice/auth/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully!');
        // Optionally update localStorage with new data
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        alert('Failed to update profile!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="profileImg" className="text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              type="text"
              id="profileImg"
              name="profileImg"
              value={formData.profileImg}
              onChange={handleChange}
              className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Addresses</h2>
          {formData.addresses.map((address, index) => (
            <div key={address.addressId} className="p-6 bg-gray-100 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">Address {index + 1}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Street</label>
                  <input
                    type="text"
                    name={`address-${index}-street`}
                    value={address.street}
                    onChange={(e) => {
                      const updatedAddresses = [...formData.addresses];
                      updatedAddresses[index].street = e.target.value;
                      setFormData({ ...formData, addresses: updatedAddresses });
                    }}
                    className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <input
                    type="text"
                    name={`address-${index}-city`}
                    value={address.city}
                    onChange={(e) => {
                      const updatedAddresses = [...formData.addresses];
                      updatedAddresses[index].city = e.target.value;
                      setFormData({ ...formData, addresses: updatedAddresses });
                    }}
                    className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">State</label>
                  <input
                    type="text"
                    name={`address-${index}-state`}
                    value={address.state}
                    onChange={(e) => {
                      const updatedAddresses = [...formData.addresses];
                      updatedAddresses[index].state = e.target.value;
                      setFormData({ ...formData, addresses: updatedAddresses });
                    }}
                    className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Zip Code</label>
                  <input
                    type="text"
                    name={`address-${index}-zipCode`}
                    value={address.zipCode}
                    onChange={(e) => {
                      const updatedAddresses = [...formData.addresses];
                      updatedAddresses[index].zipCode = e.target.value;
                      setFormData({ ...formData, addresses: updatedAddresses });
                    }}
                    className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Country</label>
                  <input
                    type="text"
                    name={`address-${index}-country`}
                    value={address.country}
                    onChange={(e) => {
                      const updatedAddresses = [...formData.addresses];
                      updatedAddresses[index].country = e.target.value;
                      setFormData({ ...formData, addresses: updatedAddresses });
                    }}
                    className="mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition duration-300 mt-6">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
