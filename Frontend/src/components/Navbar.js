import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import logo from "../images/logo.jpg";
import { setUser } from "../redux/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = () => {
    dispatch(setUser(user ? null : { name: "John Doe", email: "john@example.com" }));
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      filterProducts(query);
    }, 500);
    setDebounceTimer(newTimer);
  };

  const filterProducts = (query) => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      const filtered = res.data.filter(
        (product) => product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    });
  };

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      setFilteredProducts(res.data);
    });
  }, []);

  return (
    <nav className="bg-white sticky top-0 w-full z-50 shadow-md p-2 px-4 sm:px-6 flex items-center justify-between rounded-lg">
      {/* Logo and Brand Name */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
        <h1 className="text-xl font-semibold text-blue-600 tracking-tight">QuickTradeHub</h1>
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
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <span>{product.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden sm:flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">Home</Link>
        <Link to="/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">Products</Link>
        <Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">About</Link>
        <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">Contact</Link>
      </div>

      {/* User & Cart Section */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center text-sm"
          onClick={handleAuth}
        >
          <FaUserCircle className="text-xl mr-1" />
          {user ? "Logout" : "Login"}
        </button>
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
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">Home</Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">Products</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">About</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">Contact</Link>
            </li>
            <li>
              <button
                className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center"
                onClick={handleAuth}
              >
                <FaUserCircle className="text-2xl mr-1" />
                {user ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
