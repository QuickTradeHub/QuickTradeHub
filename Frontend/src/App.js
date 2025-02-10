import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";  // Assuming you're using Redux for state management
import { store } from "./redux/store";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BuyNowPage from "./pages/BuyNowPage";
import AddAddressPage from "./pages/AddAddressPage";
import EditAddressPage from "./pages/EditAddressPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UnauthorizedPage from "./admin/UnauthorizedPage";  // Import the Unauthorized page
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./admin/UserPage";
import DashboardPage from "./pages/DashBoardPage";
import AddProductPage from "./seller/AddProductPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoriesPage from "./pages/CategoriesPage";
import SellerDashboard from "./seller/SellerDashboard";
import SellerNavbar from "./seller/SellerNavbar";
import SellerProductsPage from "./seller/SellerProductPage";
import EditProduct from "./seller/EditProduct";
import AdminNavbar from "./admin/AdminNavbar";
import UserProfilePage from "./admin/UserProfilePage";
import OrderSummary from "./pages/OrderSummary";
import UserDashboard from "./pages/UserDashborad";
import AdminProductPage from "./admin/AdminProductsPage";
import SellerInfoPage from "./admin/SellerInfoPage";

// Assuming you're using Redux or Context API to get user data (for simplicity, here we'll use a mock)git
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if the user is logged in and has the correct role
  if (!user || (requiredRole && !user.roles.includes(requiredRole))) {
    return <Navigate to="/unauthorized" />;  // Redirect to Unauthorized page if no access
  }

  return children;
};

const App = () => {
  const location = useLocation();

  // Routes to exclude header/footer/navbar
  const excludeHeaderFooterRoutes = ["/home", "/"];

  // Determine which Navbar to show based on the route
  const getNavbar = () => {
    if (location.pathname.startsWith("/seller")) {
      return <SellerNavbar />;
    }
    if (location.pathname.startsWith("/admin")) {
      return <AdminNavbar />;
    }
    return <Navbar />;
  };

  return (
    <Provider store={store}>
      <div className="App">
        {/* Conditionally render Navbar based on the route */}
        {getNavbar()}

        <div>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />
            <Route path="/buy-now" element={<BuyNowPage />} />
            <Route path="/add-address" element={<AddAddressPage />} />
            <Route path="/edit-address" element={<EditAddressPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><OrdersPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><UsersPage /></ProtectedRoute>} />
            <Route path="/seller/add-product" element={<ProtectedRoute requiredRole="SELLER"><AddProductPage /></ProtectedRoute>} />
            <Route path="/seller/dashboard" element={<ProtectedRoute requiredRole="SELLER"><SellerDashboard /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute requiredRole="ADMIN"><CategoryManagementPage /></ProtectedRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/seller/products" element={<ProtectedRoute requiredRole="SELLER"><SellerProductsPage /></ProtectedRoute>} />
            <Route path="/seller/edit-product/:productId" element={<ProtectedRoute requiredRole="SELLER"><EditProduct /></ProtectedRoute>} />
            <Route path="/admin/users/profile/:userId" element={<ProtectedRoute requiredRole="ADMIN"><UserProfilePage /></ProtectedRoute>} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/products" element={<ProtectedRoute requiredRole="ADMIN"><AdminProductPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/products/seller/:sellerId" element={<ProtectedRoute requiredRole="ADMIN"><SellerInfoPage /></ProtectedRoute>} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} /> {/* Unauthorized page route */}
          </Routes>
        </div>

        {/* Conditionally render Footer based on the route */}
        {!excludeHeaderFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </Provider>
  );
};

export default App;
