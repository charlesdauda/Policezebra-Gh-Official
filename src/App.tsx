import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ProductPage from "./Pages/ProductPage";
import Checkout from "./Pages/Checkout";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartProvider";

const App = () => {
  const { pathname } = useLocation();
  const isAccountPage = pathname === "/account" || pathname.startsWith("/account/");

  return (
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
        </Routes>
      </main>
      {!isAccountPage && <Footer />}
    </CartProvider>
  );
};

export default App;