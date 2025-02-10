import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice"; // Redux action to set user
import logo from "../images/logo.jpg";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.user); // Access user from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const debounceTimer = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if user is present in localStorage during the initial render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setUser(storedUser)); // Update Redux state with user from localStorage
    }
  }, [dispatch]);

  const handleAuth = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUser(null)); // Reset user in Redux state
    navigate("/login"); // Navigate to login page after logout
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      filterProducts(query);
    }, 500);
  };

  const filterProducts = (query) => {
    if (!query.trim()) {
      setFilteredProducts([]); // Clear results if there's no search term
      return;
    }

    axios
      .get("http://13.49.132.61:3000/products", {
        params: {
          title_like: query, // filters products based on the title
        },
      })
      .then((res) => {
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching filtered products:", err);
        setFilteredProducts([]); // In case of an error, clear the results
      });
  };

  return (
    <nav className="bg-white sticky top-0 w-full z-50 shadow-md p-2 px-4 sm:px-6 flex items-center justify-between rounded-lg">
      {/* Logo and Brand Name */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md"
        />
        <h1 className="text-xl font-semibold text-blue-600 tracking-tight hidden sm:block">
          QuickTradeHub
        </h1>
      </Link>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-3/5 sm:w-1/3 relative">
        <FaSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-transparent outline-none px-2 w-full text-sm"
        />
        {filteredProducts.length > 0 && searchTerm && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg w-full sm:w-2/3 p-4 rounded-lg max-h-60 overflow-y-auto z-50">
            <ul>
              {filteredProducts.length === 0 ? (
                <li className="text-center text-sm text-gray-600">
                  No products found
                </li>
              ) : (
                filteredProducts.map((product) => (
                  <a href={`/products/${product._id}`} key={product._id}>
                    <li
                      className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer text-sm"
                    >
                      <span>{product.title}</span>
                    </li>
                  </a>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden sm:flex items-center gap-4">
        <Link
          to="/home"
          className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
        >
          Products
        </Link>
        <Link
          to="/about"
          className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm"
        >
          Contact
        </Link>
      </div>

      {/* User & Cart Section */}
      <div className="flex items-center gap-4">
        {/* Conditional Render for Login/Logout */}
        <button
          className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-xs sm:text-sm p-1 sm:p-2"
          onClick={handleAuth}
        >
          <FaUserCircle className="text-lg mr-1" onClick={() => { navigate("/dashboard") }} />
          {user ? user.name : "Login"} {/* Ensure user has a name property */}
        </button>

        {/* Logout Button */}
        {user && (
          <button
            className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-xs sm:text-sm p-1 sm:p-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* Seller Dashboard Button */}
        {user && user.roles.includes("SELLER") && (
          <Link to="/seller/dashboard">
            <button className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-xs sm:text-sm p-1 sm:p-2">
              Seller Dashboard
            </button>
          </Link>
        )}

        {/* Wishlist Button */}
        <Link to="/wishlist">
          <button className="relative">
            <FaHeart className="text-xl text-gray-600 hover:text-blue-500 transition-all duration-200" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {wishlistItems?.length}
            </span>
          </button>
        </Link>

        {/* Cart Button */}
        <Link to="/cart">
          <button className="relative">
            <FaShoppingCart className="text-xl text-gray-600 hover:text-blue-500 transition-all duration-200" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {cartItems?.length}
            </span>
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden text-gray-600 hover:text-blue-500 transition-all duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Mobile Menu (Responsive) */}
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
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                Contact
              </Link>
            </li>
            <li>
              <button
                className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center"
                onClick={handleAuth}
              >
                <FaUserCircle className="text-2xl mr-1" />
                {user ? user.name : "Login"} {/* Ensure user has a name property */}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
