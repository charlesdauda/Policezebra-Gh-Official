import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ProductPage from "./Pages/ProductPage";
import Checkout from "./Pages/Checkout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyOtp from "./Pages/VerifyOtp";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartProvider";
import { AuthProvider } from "./context/AuthProvider";

const App = () => {
  const { pathname } = useLocation();
  const isAccountPage = pathname === "/account" || pathname.startsWith("/account/");

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        {!isAccountPage && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Register />} />
            <Route path="/account/register" element={<Navigate to="/account" replace />} />
            <Route path="/account/login" element={<Login />} />
            <Route path="/account/verify" element={<VerifyOtp />} />
            <Route path="/account/forgot-password" element={<ForgotPassword />} />
            <Route path="/account/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        {!isAccountPage && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
};

export default App;