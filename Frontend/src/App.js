import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import Navbar from "./components/Navbar"; // Added Navbar
import Footer from "./components/Footer"; // Added Footer
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  const location = useLocation();
  const excludeHeaderFooterRoutes = []//'/login', '/register','/reset-password'];
  return (
    <Provider store={store}>
      
        <div className="App">
          {!excludeHeaderFooterRoutes.includes(location.pathname) && <  Navbar />} {/* Navbar available for all pages */}
          <div >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/product/:productId" element={<ProductDetailsPage />}/>
              <Route path="/buy-now" element={<BuyNowPage />} />
              <Route path="/add-address" element={<AddAddressPage />} />
              <Route path="/edit-address" element={<EditAddressPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/register" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />

            </Routes>
          </div>
          {!excludeHeaderFooterRoutes.includes(location.pathname) && <Footer /> } {/* Footer available for all pages */}
        </div>
    </Provider>
  );
};

export default App;
