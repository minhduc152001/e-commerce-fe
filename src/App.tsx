import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreateProduct from "./pages/CreateProduct";
import DetailedProductPage from "./pages/DetailedProductPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ListOrderPage from "./pages/ListOrderPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import CreateReview from "./pages/CreateReview";
import AppLayout from "./layout/AppLayout"; // Layout with navbar
import ListProductsPage from "./pages/ListProductsPage";
import ProductTierPage from "./pages/ProductTierPage";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Assuming "role" is stored as "ADMIN" or "USER"

  return (
    <div>
      <ToastContainer
        autoClose={5000}
        style={{ position: "fixed", top: "32px", zIndex: "999999999" }}
        position="top-center"
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Routes Without Navbar */}
          <Route path="/product/:id" element={<DetailedProductPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes */}
          {isLoggedIn ? (
            <>
              {/* Routes With Navbar */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/gio-hang" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/don-hang" element={<ListOrderPage />} />

                {/* ADMIN-Only Routes */}
                {userRole === "ADMIN" && (
                  <>
                    <Route path="/create-product" element={<CreateProduct />} />
                    <Route path="/create-review" element={<CreateReview />} />
                    <Route
                      path="/list-products"
                      element={<ListProductsPage />}
                    />
                    <Route
                      path="/manage-product-tiers"
                      element={<ProductTierPage />}
                    />
                  </>
                )}
              </Route>
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}

          {/* Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
