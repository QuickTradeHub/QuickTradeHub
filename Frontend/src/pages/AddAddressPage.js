import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddAddressPage = () => {
const location = useLocation();
const userId = location.state?.userId;

  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isPrimary: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async () => {
    const { street, city, state, zipCode, country } = addressDetails;
    if (street && city && state && zipCode && country) {
      try {
        const response = await axios.post(
          `http://13.49.132.61:8080/auth/user/${userId}/address`,
          addressDetails
        );

        if (response.status === 200) {
          alert("Address added successfully!");
          const user = JSON.parse(localStorage.getItem("user"));
          user.addresses.push(response.data);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/buy-now");
        }
      } catch (error) {
        console.error("Error adding address:", error);
        alert("Failed to add address. Please try again.");
      }
    } else {
      alert("Please fill out all the fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Address</h1>

        <div className="space-y-4">
          <input
            type="text"
            name="street"
            value={addressDetails.street}
            onChange={handleChange}
            placeholder="Street Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="city"
            value={addressDetails.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="state"
            value={addressDetails.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="zipCode"
            value={addressDetails.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="country"
            value={addressDetails.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPrimary"
              checked={addressDetails.isPrimary}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Set as Primary Address</label>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg mt-6 hover:bg-blue-700"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

export default AddAddressPage;
