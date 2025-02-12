import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import logo from "../images/logo.jpg";

const AdminNavbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  const handleAuth = () => {
    if (user) {
      navigate("/admin/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <nav className="bg-white sticky top-0 w-full z-50 shadow-md p-2 px-4 sm:px-6 flex items-center justify-between rounded-lg">
      <Link to="/admin" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md"
        />
        <h1 className="text-xl font-semibold text-blue-600 tracking-tight hidden sm:block">
          QuickTradeHub
        </h1>
      </Link>

      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-3/5 sm:w-1/3 relative">
        <FaSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for products, users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none px-2 w-full text-sm"
        />
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          Dashboard
        </Link>
        <Link to="/admin/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          Products
        </Link>
        <Link to="/admin/users" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          Users
        </Link>
        <Link to="/admin/orders" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          Orders
        </Link>
        <Link to="/admin/categories" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          Categories
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-xs sm:text-sm p-1 sm:p-2"
          onClick={handleAuth}
        >
          <FaUserCircle className="text-lg mr-1" />
          {user ? user.name : "Login"}
        </button>

        {user && (
          <button
            className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-xs sm:text-sm p-1 sm:p-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-1" />
            Logout
          </button>
        )}
      </div>

      <button
        className="sm:hidden text-gray-600 hover:text-blue-500 transition-all duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars className="text-2xl" />
      </button>

      {menuOpen && (
        <div className="absolute top-0 left-0 right-0 bg-white p-6 shadow-lg sm:hidden z-50 rounded-lg">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            X
          </button>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Settings
              </Link>
            </li>
            <li>
              <button
                className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
