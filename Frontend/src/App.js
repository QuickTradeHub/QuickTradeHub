import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar /> {/* Navbar available for all pages */}
          <div className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/product/:productId"
                element={<ProductDetailsPage />}
              />
              <Route path="/buy-now" element={<BuyNowPage />} />
              <Route path="/add-address" element={<AddAddressPage />} />
              <Route path="/edit-address" element={<EditAddressPage />} />
            </Routes>
          </div>
          <Footer /> {/* Footer available for all pages */}
        </div>
      </Router>
    </Provider>
  );
};

export default App;
