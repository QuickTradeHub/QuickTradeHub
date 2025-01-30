import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddAddressPage = () => {
  const [newAddress, setNewAddress] = useState("");
  const navigate = useNavigate();

  const handleAddAddress = () => {
    if (newAddress) {
      // In real scenarios, this should be updated in state or backend
      alert(`New address added: ${newAddress}`);
      navigate("/buy-now"); // Navigate back to the BuyNow page
    } else {
      alert("Please enter an address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Address</h1>

        <div className="mb-6">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter new address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

export default AddAddressPage;
