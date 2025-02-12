import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle, FaBars, FaBoxOpen, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import logo from "../images/logo.jpg";

const SellerNavbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const debounceTimer = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  const handleAuth = () => {
    if (user) {
      navigate("/sellerprofile");
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
      setFilteredProducts([]);
      return;
    }
    const sellerId = JSON.parse(localStorage.getItem("user")).userId;
    axios
      .get(`https://quicktradehub.in/productservice/products/seller/${sellerId}`, {
        params: { title_like: query },
      })
      .then((res) => {
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching filtered products:", err);
        setFilteredProducts([]);
      });
  };

  return (
    <nav className="bg-white sticky top-0 w-full z-50 shadow-md p-2 px-4 sm:px-6 flex items-center justify-between rounded-lg">
      <Link to="/seller/dashboard" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md"
        />
        <h1 className="text-xl font-semibold text-blue-600 tracking-tight hidden sm:block">
          QuickTradeHub Seller
        </h1>
      </Link>

      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-3/5 sm:w-1/3 relative">
        <FaSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search your products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-transparent outline-none px-2 w-full text-sm"
        />
        {filteredProducts.length > 0 && searchTerm && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg w-full sm:w-2/3 p-4 rounded-lg max-h-60 overflow-y-auto z-50">
            <ul>
              {filteredProducts.map((product) => (
                <Link to={`/seller/products/${product._id}`} key={product._id}>
                  <li className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer text-sm">
                    <span>{product.title}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <Link to="/seller/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          <FaBoxOpen className="inline mr-1" /> My Products
        </Link>
        <Link to="/seller/add-product" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          <FaPlusCircle className="inline mr-1" /> Add Product
        </Link>
        <Link to="/seller/orders" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 text-sm">
          <FaClipboardList className="inline mr-1" /> Orders
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
              <Link to="/seller/products" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                My Products
              </Link>
            </li>
            <li>
              <Link to="/seller/add-product" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Add Product
              </Link>
            </li>
            <li>
              <Link to="/seller/orders" className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium">
                Orders
              </Link>
            </li>
            <li>
              <button
                className="text-gray-600 hover:text-blue-500 transition-all duration-200 flex items-center"
                onClick={handleAuth}
              >
                <FaUserCircle className="text-2xl mr-1" />
                {user ? user.name : "Login"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SellerNavbar;
