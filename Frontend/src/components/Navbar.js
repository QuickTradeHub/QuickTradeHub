import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // To access Redux store
import axios from "axios";
import logo from "../images/logo.jpg"
import { setUser } from "../redux/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleAuth = () => {
    dispatch(setUser(user ? null : { name: "John Doe", email: "john@example.com" }));
    navigate("/login" );
  };

  // Access the cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // State to store the search term and results
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); // Store all products fetched from the API
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search term

  // State for debounce
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially display all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer to filter products after the user stops typing
    const newTimer = setTimeout(() => {
      filterProducts(query);
    }, 500); // 500ms delay after the last keypress
    setDebounceTimer(newTimer);
  };

  // Function to filter products based on search term
  const filterProducts = (query) => {
    if (query.trim() === "") {
      setFilteredProducts(products); // Show all products if search term is empty
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) || // Match title
          product.category.toLowerCase().includes(query.toLowerCase()) // Match category
      );
      setFilteredProducts(filtered);
    }
  };

  // Navigate to search results page when user presses Enter or clicks search
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
    
  };

  return (
    <nav  className="bg-white fixed w-full shadow-md p-3 flex items-center justify-between px-6">
      {/* Logo */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="logo" className="w-20 h-12 rounded-full shadow-lg mix-blend-multiply mask mask-circle" />
      </h1>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full sm:w-1/2">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-transparent outline-none px-2 w-full"
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
        />
      </div>

      {/* Search Results Dropdown */}
      {filteredProducts.length > 0 && searchTerm && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-lg w-1/2 p-4 rounded-lg max-h-60 overflow-y-auto">
          <ul>
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)} // Navigate to product detail
              >
                <span>{product.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User & Cart Section */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-blue-500 flex items-center"
          onClick={handleAuth}
        >
          <FaUserCircle className="text-2xl mr-1" />
          {user ? "Logout" : "Login"}
        </button>
        <Link to="/cart">
          <button className="relative">
            <FaShoppingCart className="text-2xl text-gray-600 hover:text-blue-500" />

            {/* Cart item count */}
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {cartItems?.length} {/* Dynamic cart count */}
            </span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
