import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500">
      <div className="text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-4">Unauthorized Access</h1>
        <p className="text-xl mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="text-lg text-blue-400 hover:text-blue-600 transition-colors">
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
