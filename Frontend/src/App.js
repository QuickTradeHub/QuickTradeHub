import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BuyNowPage from "./pages/BuyNowPage";
import AddAddressPage from "./pages/AddAddressPage";
import EditAddressPage from "./pages/EditAddressPage";
import Navbar from "./components/Navbar"; // Default Navbar
import Footer from "./components/Footer"; // Footer
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UserPage";
import DashboardPage from "./pages/DashBoardPage";
import { Settings } from "lucide-react";
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
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/edit-product/:productId" element={<EditProduct />} />
            <Route path="/admin/users/profile/:userId" element={<UserProfilePage />} />
          </Routes>
        </div>

        {/* Conditionally render Footer based on the route */}
        {!excludeHeaderFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </Provider>
  );
};

export default App;
