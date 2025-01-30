import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditAddressPage = () => {
  const { state } = useLocation();
  const [updatedAddress, setUpdatedAddress] = useState(state?.address || "");
  const navigate = useNavigate();

  const handleEditAddress = () => {
    if (updatedAddress) {
      // In real scenarios, this should update the address in state or backend
      alert(`Address updated to: ${updatedAddress}`);
      navigate("/buy-now"); // Navigate back to the BuyNow page
    } else {
      alert("Please enter a valid address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Address</h1>

        <div className="mb-6">
          <input
            type="text"
            value={updatedAddress}
            onChange={(e) => setUpdatedAddress(e.target.value)}
            placeholder="Edit address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg"
          onClick={handleEditAddress}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditAddressPage;
