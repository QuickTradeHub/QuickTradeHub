import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SellerInfoPage = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`http://13.49.132.61:8080/auth/user/${sellerId}`);
        const data = await response.json();
        setSeller(data);
      } catch (error) {
        console.error("Failed to fetch seller info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="text-2xl text-white animate-pulse">Loading seller info...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="text-2xl text-white">Seller not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
          Seller Information
        </h1>

        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
          <div className="mb-6 md:mb-0">
            <img
              src={seller.profileImg || "https://via.placeholder.com/150"}
              alt={seller.userName}
              className="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">
              {seller.firstName} {seller.lastName}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-2">{seller.email}</p>
            <p className="text-gray-600 text-sm sm:text-base mb-2">{seller.phone}</p>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Status:{" "}
              <span
                className={`${
                  seller.status === "ACTIVE" ? "text-green-500" : "text-red-500"
                } font-semibold`}
              >
                {seller.status}
              </span>
            </p>
            <button className="px-6 py-2 mt-4 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 focus:outline-none transition-all">
              Contact Seller
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Products by {seller.firstName}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seller.products && seller.products.length > 0 ? (
              seller.products.map((product) => (
                <div key={product._id} className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h4>
                  <p className="text-sm text-gray-600 truncate mb-2">{product.description}</p>
                  <p className="text-xl text-green-500 font-bold">₹{product.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">No products listed by this seller.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoPage;
