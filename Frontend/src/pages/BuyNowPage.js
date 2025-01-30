import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState([
    { id: 1, address: "123 Main Street, City A" },
    { id: 2, address: "456 Elm Street, City B" },
    { id: 3, address: "789 Oak Avenue, City C" }
  ]);

  useEffect(() => {
    if (!product) {
      const storedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
      setProduct(storedProduct);
    }
  }, [product]);

  if (!product) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-500">Product not found</div>;
  }

  const handleEditAddress = (address) => {
    navigate("/edit-address", { state: { address } });
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Checkout</h1>

        {/* Address Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Select Address</h2>
          <div className="mt-2">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-center space-x-4 mb-2">
                <input
                  type="radio"
                  name="address"
                  value={address.address}
                  checked={selectedAddress === address.address}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="h-4 w-4"
                />
                <span className="text-gray-800">{address.address}</span>
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => handleEditAddress(address)}
                  className="text-blue-600 cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
          <button
            className="mt-3 text-blue-600 font-semibold hover:underline"
            onClick={() => navigate("/add-address")}
          >
            + Add New Address
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
          <div className="flex items-center mt-3">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="text-lg font-medium">{product.title}</h3>
              <p className="text-gray-600">Price: <span className="text-green-600 font-bold">${product.price}</span></p>
            </div>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-green-600">${product.price}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg transition-transform transform hover:scale-105 hover:bg-blue-700 shadow-lg"
          disabled={!selectedAddress}
        >
          {selectedAddress ? "Proceed to Payment" : "Select an Address First"}
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;
